"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import Script from "next/script";
import { createContext, useContext, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  googleConsentState,
  parseAnalyticsConsent,
  shouldLoadAnalytics,
} from "@/lib/analytics/consent.mjs";
import type { AnalyticsConsentChoice, AnalyticsConsentState } from "@/lib/analytics/consent.mjs";

interface AnalyticsConsentContextValue {
  analyticsAvailable: boolean;
  openPreferences: () => void;
}

const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue | null>(null);
let memoryConsent: Exclude<AnalyticsConsentState, "loading"> = "unset";

function getConsentSnapshot(): AnalyticsConsentState {
  if (typeof window === "undefined") return "loading";
  try {
    const stored = parseAnalyticsConsent(window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY));
    if (stored) memoryConsent = stored;
  } catch {
    // The in-memory choice still applies for this page if local storage is unavailable.
  }
  return memoryConsent;
}

function getServerConsentSnapshot(): AnalyticsConsentState {
  return "loading";
}

function subscribeToConsent(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY) return;
    memoryConsent = parseAnalyticsConsent(event.newValue) ?? "unset";
    onChange();
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, onChange);
  };
}

function subscribeToNothing() {
  return () => undefined;
}

function writeConsent(choice: AnalyticsConsentChoice) {
  memoryConsent = choice;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, choice);
  } catch {
    // Keep the explicit choice in memory for the remainder of this page view.
  }
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_CHANGED_EVENT));
}

function removeAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name && name.startsWith("_ga")));
  const apexHost = window.location.hostname.replace(/^www\./, "");
  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${apexHost}; SameSite=Lax`;
  }
}

function revokeAnalytics() {
  window.gtag?.("consent", "update", googleConsentState("denied"));
  window.__fixlookupAnalyticsEnabled = false;
  removeAnalyticsCookies();
}

function ConsentAwareGoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [privacyBootstrapReady, setPrivacyBootstrapReady] = useState(false);
  const defaultConsent = JSON.stringify(googleConsentState("denied"));
  const grantedConsent = JSON.stringify(googleConsentState("granted"));
  const bootstrap = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
window.gtag('consent', 'default', ${defaultConsent});
window.gtag('consent', 'update', ${grantedConsent});
window.gtag('set', 'allow_google_signals', false);
window.gtag('set', 'allow_ad_personalization_signals', false);
window.__fixlookupAnalyticsEnabled = true;
`;
  return (
    <>
      <Script
        id="fixlookup-ga-privacy-bootstrap"
        strategy="afterInteractive"
        onReady={() => setPrivacyBootstrapReady(true)}
      >
        {bootstrap}
      </Script>
      {privacyBootstrapReady ? <GoogleAnalytics gaId={measurementId} /> : null}
    </>
  );
}

export function AnalyticsConsentProvider({
  children,
  measurementId,
  messages,
  privacyPath,
}: {
  children: ReactNode;
  measurementId: string | null;
  messages: Record<string, string>;
  privacyPath: string;
}) {
  const analyticsAvailable = Boolean(measurementId);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const consent = useSyncExternalStore(
    analyticsAvailable ? subscribeToConsent : subscribeToNothing,
    analyticsAvailable ? getConsentSnapshot : getServerConsentSnapshot,
    getServerConsentSnapshot,
  );

  function openPreferences() {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  function applyChoice(choice: AnalyticsConsentChoice) {
    const reloadToFullyDisable = choice === "denied" && consent === "granted";
    if (choice === "denied") revokeAnalytics();
    writeConsent(choice);
    dialogRef.current?.close();
    if (reloadToFullyDisable) window.location.reload();
  }

  const contextValue = useMemo(
    () => ({ analyticsAvailable, openPreferences }),
    [analyticsAvailable],
  );

  const currentChoice = consent === "granted"
    ? messages.analyticsCurrentAccepted
    : consent === "denied"
      ? messages.analyticsCurrentRejected
      : messages.analyticsCurrentUnset;

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      {analyticsAvailable && consent === "unset" ? (
        <section className="analytics-consent-banner" role="dialog" aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description">
          <div>
            <h2 id="analytics-consent-title">{messages.analyticsConsentTitle}</h2>
            <p id="analytics-consent-description">{messages.analyticsConsentBody}</p>
            <Link href={privacyPath}>{messages.analyticsPrivacyLink}</Link>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" className="button-secondary" onClick={() => applyChoice("denied")}>{messages.analyticsReject}</button>
            <button type="button" className="button-primary" onClick={() => applyChoice("granted")}>{messages.analyticsAccept}</button>
          </div>
        </section>
      ) : null}
      {analyticsAvailable ? (
        <dialog className="analytics-preferences-dialog" ref={dialogRef} aria-labelledby="analytics-preferences-title" aria-describedby="analytics-preferences-description">
          <div className="analytics-preferences-content">
            <h2 id="analytics-preferences-title">{messages.analyticsPreferencesTitle}</h2>
            <p id="analytics-preferences-description">{messages.analyticsPreferencesBody}</p>
            <p className="analytics-current-choice">{currentChoice}</p>
            <Link href={privacyPath} onClick={() => dialogRef.current?.close()}>{messages.analyticsPrivacyLink}</Link>
            <div className="analytics-consent-actions">
              <button type="button" className="button-secondary" onClick={() => applyChoice("denied")}>{messages.analyticsReject}</button>
              <button type="button" className="button-primary" onClick={() => applyChoice("granted")}>{messages.analyticsAccept}</button>
            </div>
            <button type="button" className="button-quiet analytics-dialog-close" onClick={() => dialogRef.current?.close()}>{messages.analyticsClose}</button>
          </div>
        </dialog>
      ) : null}
      {measurementId && shouldLoadAnalytics({ analyticsAvailable, consent }) ? (
        <ConsentAwareGoogleAnalytics measurementId={measurementId} />
      ) : null}
    </AnalyticsConsentContext.Provider>
  );
}

export function AnalyticsPreferencesButton({ label }: { label: string }) {
  const context = useContext(AnalyticsConsentContext);
  if (!context?.analyticsAvailable) return null;
  return <button type="button" className="analytics-preferences-trigger" onClick={context.openPreferences}>{label}</button>;
}
