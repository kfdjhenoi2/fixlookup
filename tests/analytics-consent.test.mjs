import assert from "node:assert/strict";
import test from "node:test";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  googleConsentState,
  isAnalyticsBuildEnabled,
  normalizeGaMeasurementId,
  parseAnalyticsConsent,
  shouldLoadAnalytics,
} from "../lib/analytics/consent.mjs";

test("analytics loads only after an explicit grant", () => {
  assert.equal(shouldLoadAnalytics({ analyticsAvailable: true, consent: "loading" }), false);
  assert.equal(shouldLoadAnalytics({ analyticsAvailable: true, consent: "unset" }), false);
  assert.equal(shouldLoadAnalytics({ analyticsAvailable: true, consent: "denied" }), false);
  assert.equal(shouldLoadAnalytics({ analyticsAvailable: false, consent: "granted" }), false);
  assert.equal(shouldLoadAnalytics({ analyticsAvailable: true, consent: "granted" }), true);
});

test("consent storage accepts only the supported durable choices", () => {
  assert.equal(ANALYTICS_CONSENT_STORAGE_KEY, "fixlookup.analytics-consent.v1");
  assert.equal(parseAnalyticsConsent("granted"), "granted");
  assert.equal(parseAnalyticsConsent("denied"), "denied");
  assert.equal(parseAnalyticsConsent("unset"), null);
  assert.equal(parseAnalyticsConsent(null), null);
});

test("analytics configuration is production-only unless local testing is explicit", () => {
  assert.equal(normalizeGaMeasurementId(" G-PCYPWCPML1 "), "G-PCYPWCPML1");
  assert.equal(normalizeGaMeasurementId("G-invalid-value"), null);
  assert.equal(isAnalyticsBuildEnabled({ measurementId: "G-PCYPWCPML1", nodeEnvironment: "development" }), false);
  assert.equal(isAnalyticsBuildEnabled({ measurementId: "G-PCYPWCPML1", nodeEnvironment: "development", explicitlyEnabled: true }), true);
  assert.equal(isAnalyticsBuildEnabled({ measurementId: "G-PCYPWCPML1", nodeEnvironment: "production" }), true);
  assert.equal(isAnalyticsBuildEnabled({ measurementId: "G-PCYPWCPML1", nodeEnvironment: "production", indexingBlocked: true }), false);
  assert.equal(isAnalyticsBuildEnabled({ measurementId: null, nodeEnvironment: "production" }), false);
});

test("advertising consent remains denied for every analytics choice", () => {
  const granted = googleConsentState("granted");
  const denied = googleConsentState("denied");
  assert.deepEqual(granted, {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  assert.deepEqual(denied, {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
});
