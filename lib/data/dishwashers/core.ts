import type {
  DeviceCategoryKnowledge,
  DeviceModelKnowledge,
  ManufacturerKnowledge,
  MarketKnowledge,
  ModelFamilyKnowledge,
  TroubleshooterKnowledgeNode,
} from "../../types";
import { dishwasherCategoryId } from "./constants";

export const manufacturerKnowledge: ManufacturerKnowledge[] = [
  "bosch",
  "siemens",
  "electrolux",
  "whirlpool",
  "samsung",
  "lg",
].map((slug) => ({
  id: `manufacturer-${slug}`,
  categoryIds: [dishwasherCategoryId],
  verificationStatus: "verified" as const,
}));

export const categoryKnowledge: DeviceCategoryKnowledge[] = [
  {
    id: dishwasherCategoryId,
    verificationStatus: "verified",
  },
];

export const marketKnowledge: MarketKnowledge[] = [
  { id: "market-us" },
  { id: "market-uk" },
  { id: "market-ie" },
  { id: "market-mx" },
];

export const modelFamilyKnowledge: ModelFamilyKnowledge[] = [];
export const modelKnowledge: DeviceModelKnowledge[] = [];

export const troubleshooterKnowledge: TroubleshooterKnowledgeNode[] = [
  { id: "start", kind: "question", safetyLevel: "caution", nextNodeIds: ["stop", "details"] },
  { id: "details", kind: "question", safetyLevel: "user-safe", nextNodeIds: ["sources", "record"] },
  { id: "record", kind: "outcome", safetyLevel: "user-safe" },
  { id: "sources", kind: "outcome", safetyLevel: "user-safe" },
  { id: "stop", kind: "outcome", safetyLevel: "professional-only" },
];

