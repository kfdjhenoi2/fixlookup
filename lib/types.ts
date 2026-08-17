export type VerificationStatus = "demo" | "needs-review" | "verified";

export type SafetyLevel = "user-safe" | "caution" | "professional-only";

export type SourceType =
  | "manufacturer-manual"
  | "manufacturer-support"
  | "official-service-document"
  | "reputable-technical"
  | "editorial-placeholder";

// Stable, language-independent knowledge records. Localized copy and slugs are
// deliberately absent from these types.
export interface DeviceCategoryKnowledge {
  id: string;
  manufacturerIds: string[];
  verificationStatus: VerificationStatus;
}

export interface ManufacturerKnowledge {
  id: string;
  categoryIds: string[];
  verificationStatus: VerificationStatus;
}

export interface ModelFamilyKnowledge {
  id: string;
  categoryId: string;
  manufacturerId: string;
  modelIds: string[];
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

export interface DeviceModelKnowledge {
  id: string;
  modelNumber: string;
  categoryId: string;
  manufacturerId: string;
  familyId: string;
  guideIds: string[];
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  isFictional: boolean;
}

export interface ProblemKnowledge {
  id: string;
  categoryId: string;
  guideId?: string;
  sourceIds: string[];
  relatedProblemIds: string[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
}

export interface ErrorCodeKnowledge {
  id: string;
  code: string;
  aliases: string[];
  signalIds: string[];
  categoryId: string;
  manufacturerId: string;
  modelFamilyIds: string[];
  guideId?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  isFictional: boolean;
}

export interface TroubleshootingStepKnowledge {
  id: string;
  sourceIds: string[];
  safetyLevel: SafetyLevel;
}

export interface TroubleshootingGuideKnowledge {
  id: string;
  categoryId: string;
  canonicalProblemId: string;
  problemIds: string[];
  errorCodeIds: string[];
  steps: TroubleshootingStepKnowledge[];
  sourceIds: string[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
  lastReviewed: string | null;
  reviewIntervalDays: number | null;
}

export interface SourceKnowledge {
  id: string;
  publisher: string;
  type: SourceType;
  url?: string;
  publishedAt?: string;
  accessedAt?: string;
  lastReviewed: string | null;
  reviewIntervalDays: number | null;
  verificationStatus: VerificationStatus;
}

export interface TroubleshooterKnowledgeNode {
  id: string;
  kind: "question" | "outcome";
  safetyLevel: SafetyLevel;
  nextNodeIds?: string[];
}

// Locale presentation records. These are joined to knowledge records by stable ID.
export interface CategoryTranslation {
  slug: string;
  name: string;
  singularName: string;
  description: string;
}

export interface ManufacturerTranslation {
  slug: string;
  name: string;
  overview: string;
}

export interface ModelFamilyTranslation {
  slug: string;
  name: string;
}

export interface ModelTranslation {
  slug: string;
  name: string;
  note: string;
}

export interface ProblemTranslation {
  slug: string;
  title: string;
  summary: string;
  symptomLabels: string[];
}

export interface ErrorCodeTranslation {
  slug: string;
  title: string;
  signalLabels: string[];
  summary: string;
  sourceScope: string;
  applicabilityNote: string;
}

export interface GuideTranslation {
  slug: string;
  title: string;
  steps: Record<string, { title: string; instruction: string }>;
}

export interface SourceTranslation {
  title: string;
  note?: string;
}

export interface TroubleshooterTranslation {
  eyebrow: string;
  title: string;
  body: string;
  optionLabels?: string[];
}

// Locale-composed view models used by the UI.
export interface DeviceCategory extends DeviceCategoryKnowledge, CategoryTranslation {}
export interface Manufacturer extends ManufacturerKnowledge, ManufacturerTranslation {}
export interface ModelFamily extends ModelFamilyKnowledge, ModelFamilyTranslation {}
export interface DeviceModel extends DeviceModelKnowledge, ModelTranslation {}
export interface Problem extends ProblemKnowledge, ProblemTranslation {}
export interface ErrorCode extends ErrorCodeKnowledge, ErrorCodeTranslation {}
export interface TroubleshootingStep extends TroubleshootingStepKnowledge {
  title: string;
  instruction: string;
}
export interface TroubleshootingGuide
  extends Omit<TroubleshootingGuideKnowledge, "steps">,
    Omit<GuideTranslation, "steps"> {
  steps: TroubleshootingStep[];
}
export interface SourceReference extends SourceKnowledge, SourceTranslation {}

export interface SearchItem {
  id: string;
  label: string;
  description: string;
  type: "device" | "manufacturer" | "model" | "problem" | "errorCode";
  href: string;
  keywords: string[];
}

export interface TroubleshooterOption {
  label: string;
  nextNodeId: string;
}

interface TroubleshooterNodeBase {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  safetyLevel: SafetyLevel;
}

export interface TroubleshooterQuestionNode extends TroubleshooterNodeBase {
  kind: "question";
  options: TroubleshooterOption[];
}

export interface TroubleshooterOutcomeNode extends TroubleshooterNodeBase {
  kind: "outcome";
}

export type TroubleshooterNode =
  | TroubleshooterQuestionNode
  | TroubleshooterOutcomeNode;
