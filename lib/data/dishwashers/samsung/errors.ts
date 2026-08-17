import { buildErrorRecords } from "../builders";

export const samsungErrors = buildErrorRecords([
  { id: "error-samsung-4c", code: "4C", aliases: ["4E"], manufacturerId: "manufacturer-samsung", marketIds: ["market-uk"], sourceIds: ["source-samsung-water-codes"], problemIds: ["problem-dishwasher-not-filling"], guideIds: ["guide-dishwasher-not-filling"], safetyLevel: "caution" },
  { id: "error-samsung-5c", code: "5C", aliases: ["5E"], manufacturerId: "manufacturer-samsung", marketIds: ["market-uk"], sourceIds: ["source-samsung-water-codes"], problemIds: ["problem-dishwasher-not-draining"], guideIds: ["guide-dishwasher-not-draining"], safetyLevel: "caution" },
  { id: "error-samsung-lc", code: "LC", aliases: ["LE"], manufacturerId: "manufacturer-samsung", marketIds: ["market-uk"], sourceIds: ["source-samsung-water-codes"], problemIds: ["problem-dishwasher-leaking"], guideIds: ["guide-dishwasher-leaking"], safetyLevel: "caution" },
  { id: "error-samsung-oc", code: "OC", aliases: ["0C", "oE"], manufacturerId: "manufacturer-samsung", marketIds: ["market-mx"], sourceIds: ["source-samsung-error-codes-mx"], problemIds: ["problem-dishwasher-not-draining", "problem-dishwasher-leaking"], guideIds: ["guide-dishwasher-not-draining", "guide-dishwasher-leaking"], safetyLevel: "caution" },
]);

