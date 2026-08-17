export type AnalyticsConsentChoice = "granted" | "denied";
export type AnalyticsConsentState = AnalyticsConsentChoice | "unset" | "loading";

export const ANALYTICS_CONSENT_STORAGE_KEY: "fixlookup.analytics-consent.v1";
export const ANALYTICS_CONSENT_CHANGED_EVENT: "fixlookup:analytics-consent-changed";

export function parseAnalyticsConsent(value: string | null | undefined): AnalyticsConsentChoice | null;
export function normalizeGaMeasurementId(value: string | null | undefined): string | null;
export function isAnalyticsBuildEnabled(options: {
  measurementId: string | null | undefined;
  nodeEnvironment: string | undefined;
  explicitlyEnabled?: boolean;
  indexingBlocked?: boolean;
}): boolean;
export function shouldLoadAnalytics(options: {
  analyticsAvailable: boolean;
  consent: AnalyticsConsentState;
}): boolean;
export function googleConsentState(choice: AnalyticsConsentChoice): {
  ad_storage: "denied";
  ad_user_data: "denied";
  ad_personalization: "denied";
  analytics_storage: "granted" | "denied";
};
