export const ANALYTICS_CONSENT_STORAGE_KEY = "fixlookup.analytics-consent.v1";
export const ANALYTICS_CONSENT_CHANGED_EVENT = "fixlookup:analytics-consent-changed";

export function parseAnalyticsConsent(value) {
  return value === "granted" || value === "denied" ? value : null;
}

export function normalizeGaMeasurementId(value) {
  const normalized = value?.trim();
  return normalized && /^G-[A-Z0-9]+$/.test(normalized) ? normalized : null;
}

export function isAnalyticsBuildEnabled({ measurementId, nodeEnvironment, explicitlyEnabled = false, indexingBlocked = false }) {
  return Boolean(normalizeGaMeasurementId(measurementId)) &&
    indexingBlocked !== true &&
    (nodeEnvironment === "production" || explicitlyEnabled === true);
}

export function shouldLoadAnalytics({ analyticsAvailable, consent }) {
  return analyticsAvailable === true && consent === "granted";
}

export function googleConsentState(choice) {
  return {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice === "granted" ? "granted" : "denied",
  };
}
