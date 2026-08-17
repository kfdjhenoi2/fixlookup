import { buildErrorRecords } from "../builders";

export const boschErrors = buildErrorRecords([
  { id: "error-bosch-e15", code: "E15", manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-e15", "source-bosch-error-codes"], problemIds: ["problem-dishwasher-leaking"], guideIds: ["guide-dishwasher-leaking"], safetyLevel: "caution" },
  { id: "error-bosch-e24", code: "E24", aliases: ["E-24"], manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-e24", "source-bosch-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
  { id: "error-bosch-e12", code: "E12", manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-error-codes"], problemIds: ["problem-dishwasher-not-heating"], guideIds: ["guide-dishwasher-not-heating"], safetyLevel: "user-safe" },
  { id: "error-bosch-e16", code: "E16", aliases: ["E17"], manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-error-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-bosch-e18", code: "E18", manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-error-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-bosch-e22", code: "E22", aliases: ["E-22"], manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
  { id: "error-bosch-e25", code: "E25", aliases: ["E-25"], manufacturerId: "manufacturer-bosch", marketIds: ["market-us"], sourceIds: ["source-bosch-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
]);

