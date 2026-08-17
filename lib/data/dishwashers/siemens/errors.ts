import { buildErrorRecords } from "../builders";

export const siemensErrors = buildErrorRecords([
  { id: "error-siemens-e15", code: "E15", manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-leaking"], guideIds: ["guide-dishwasher-leaking"], safetyLevel: "caution" },
  { id: "error-siemens-e12", code: "E12", manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-not-heating"], guideIds: ["guide-dishwasher-not-heating"], safetyLevel: "user-safe" },
  { id: "error-siemens-e14", code: "E14", manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-siemens-e16", code: "E16", manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-siemens-e18", code: "E18", manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-siemens-e22", code: "E22", manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
  { id: "error-siemens-e24", code: "E24", aliases: ["E25"], manufacturerId: "manufacturer-siemens", marketIds: ["market-ie"], sourceIds: ["source-siemens-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
]);

