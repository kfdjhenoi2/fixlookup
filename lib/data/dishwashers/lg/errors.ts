import { buildErrorRecords } from "../builders";

export const lgErrors = buildErrorRecords([
  { id: "error-lg-ae", code: "AE", aliases: ["EI", "FE", "RE"], manufacturerId: "manufacturer-lg", marketIds: ["market-us"], sourceIds: ["source-lg-error-codes"], problemIds: ["problem-dishwasher-leaking", "problem-dishwasher-excessive-foam"], guideIds: ["guide-dishwasher-leaking", "guide-dishwasher-excessive-foam"], safetyLevel: "caution" },
  { id: "error-lg-ie", code: "IE", manufacturerId: "manufacturer-lg", marketIds: ["market-us"], sourceIds: ["source-lg-error-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-lg-oe", code: "OE", manufacturerId: "manufacturer-lg", marketIds: ["market-us"], sourceIds: ["source-lg-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
]);
