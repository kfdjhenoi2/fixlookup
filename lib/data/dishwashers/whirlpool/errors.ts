import { buildErrorRecords } from "../builders";

export const whirlpoolErrors = buildErrorRecords([
  { id: "error-whirlpool-f8e4", code: "F8E4", aliases: ["F8 E4"], manufacturerId: "manufacturer-whirlpool", marketIds: ["market-us"], sourceIds: ["source-whirlpool-f8e4", "source-whirlpool-error-codes"], problemIds: ["problem-dishwasher-leaking", "problem-dishwasher-excessive-foam"], guideIds: ["guide-dishwasher-leaking", "guide-dishwasher-excessive-foam"], safetyLevel: "caution" },
  { id: "error-whirlpool-f9e1", code: "F9E1", aliases: ["F9 E1", "F9-E1"], manufacturerId: "manufacturer-whirlpool", marketIds: ["market-us"], sourceIds: ["source-whirlpool-error-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
  { id: "error-whirlpool-h2o", code: "H2O", manufacturerId: "manufacturer-whirlpool", marketIds: ["market-us"], sourceIds: ["source-whirlpool-h2o"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
]);

