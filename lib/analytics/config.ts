import { isAnalyticsBuildEnabled, normalizeGaMeasurementId } from "./consent.mjs";
import { shouldBlockIndexing } from "@/lib/deployment.mjs";

export function getAnalyticsMeasurementId() {
  const measurementId = normalizeGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const explicitlyEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true";
  return isAnalyticsBuildEnabled({
    measurementId,
    nodeEnvironment: process.env.NODE_ENV,
    explicitlyEnabled,
    indexingBlocked: shouldBlockIndexing(),
  }) ? measurementId : null;
}
