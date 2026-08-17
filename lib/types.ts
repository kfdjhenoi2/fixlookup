export type VerificationStatus = "demo" | "needs-review" | "verified";

export type SafetyLevel = "user-safe" | "caution" | "professional-only";

export type SourceKind =
  | "manufacturer-manual"
  | "manufacturer-support"
  | "official-service-document"
  | "reputable-technical"
  | "editorial-placeholder";

export type EvidenceClaimKind =
  | "error-signal"
  | "error-meaning"
  | "applicability"
  | "guide-step"
  | "safety-boundary"
  | "model-relationship";

export type ApplicabilityScopeKind =
  | "manufacturer-market"
  | "model-family"
  | "exact-model"
  | "feature";

// Stable, language-independent knowledge records. Localized copy and slugs are
// deliberately absent from these types.
export interface DeviceCategoryKnowledge {
  id: string;
  verificationStatus: VerificationStatus;
}

export interface ManufacturerKnowledge {
  id: string;
  categoryIds: string[];
  verificationStatus: VerificationStatus;
}

export interface MarketKnowledge {
  id: string;
}

export interface ModelFamilyKnowledge {
  id: string;
  categoryId: string;
  manufacturerId: string;
  evidenceClaimIds: string[];
  verificationStatus: VerificationStatus;
}

export interface DeviceModelKnowledge {
  id: string;
  modelNumber: string;
  categoryId: string;
  manufacturerId: string;
  familyId?: string;
  evidenceClaimIds: string[];
  verificationStatus: VerificationStatus;
  isFictional: boolean;
}

export interface ProblemKnowledge {
  id: string;
  categoryId: string;
  relatedProblemIds: string[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
}

export interface ApplicabilityScopeKnowledge {
  id: string;
  kind: ApplicabilityScopeKind;
  categoryId: string;
  manufacturerId: string;
  marketIds: string[];
  modelFamilyIds: string[];
  modelIds: string[];
  featureTags: string[];
  exactModelConfirmationRequired: boolean;
  verificationStatus: VerificationStatus;
}

export interface EvidenceClaimKnowledge {
  id: string;
  kind: EvidenceClaimKind;
  sourceIds: string[];
  applicabilityScopeId?: string;
  verificationStatus: VerificationStatus;
}

export interface ErrorSignalKnowledge {
  id: string;
  code: string;
  aliases: string[];
  signalIds: string[];
  categoryId: string;
  manufacturerId: string;
  evidenceClaimIds: string[];
  verificationStatus: VerificationStatus;
  isFictional: boolean;
}

export interface ErrorInterpretationKnowledge {
  id: string;
  signalId: string;
  problemIds: string[];
  guideIds: string[];
  applicabilityScopeId: string;
  evidenceClaimIds: string[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
}

export interface TroubleshootingStepKnowledge {
  id: string;
  evidenceClaimIds: string[];
  safetyLevel: SafetyLevel;
}

export interface TroubleshootingGuideKnowledge {
  id: string;
  categoryId: string;
  canonicalProblemId: string;
  problemIds: string[];
  steps: TroubleshootingStepKnowledge[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
  lastReviewed: string | null;
  reviewIntervalDays: number | null;
}

export interface SourceKnowledge {
  id: string;
  publisher: string;
  kind: SourceKind;
  marketIds: string[];
  language?: string;
  url?: string;
  documentIdentifier?: string;
  revision?: string;
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

export interface ErrorSignalTranslation {
  slug: string;
  title: string;
  signalLabels: string[];
}

export interface ErrorInterpretationTranslation {
  summary: string;
  guidance: string;
}

export interface ApplicabilityScopeTranslation {
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
export interface DeviceCategory extends DeviceCategoryKnowledge, CategoryTranslation {
  manufacturerIds: string[];
}
export interface Manufacturer extends ManufacturerKnowledge, ManufacturerTranslation {}
export type Market = MarketKnowledge;
export interface ModelFamily extends ModelFamilyKnowledge, ModelFamilyTranslation {
  sourceIds: string[];
}
export interface DeviceModel extends DeviceModelKnowledge, ModelTranslation {
  guideIds: string[];
  sourceIds: string[];
}
export interface Problem extends ProblemKnowledge, ProblemTranslation {
  guideId?: string;
  sourceIds: string[];
}
export interface ApplicabilityScope extends ApplicabilityScopeKnowledge, ApplicabilityScopeTranslation {}
export type EvidenceClaim = EvidenceClaimKnowledge;
export interface ErrorInterpretation extends ErrorInterpretationKnowledge, ErrorInterpretationTranslation {
  applicability: ApplicabilityScope;
  sourceIds: string[];
}
export interface ErrorCode extends ErrorSignalKnowledge, ErrorSignalTranslation {
  interpretations: ErrorInterpretation[];
  sourceIds: string[];
  problemIds: string[];
  guideIds: string[];
  guideId?: string;
  safetyLevel: SafetyLevel;
  summary: string;
  sourceScope: string;
  applicabilityNote: string;
}
export interface TroubleshootingStep extends TroubleshootingStepKnowledge {
  title: string;
  instruction: string;
  sourceIds: string[];
}
export interface TroubleshootingGuide
  extends Omit<TroubleshootingGuideKnowledge, "steps">,
    Omit<GuideTranslation, "steps"> {
  steps: TroubleshootingStep[];
  sourceIds: string[];
}
export interface SourceReference extends SourceKnowledge, SourceTranslation {}

export interface SearchItem {
  id: string;
  label: string;
  description: string;
  type: "device" | "manufacturer" | "model" | "problem" | "errorCode";
  href: string;
  identifiers: string[];
  aliases: string[];
  manufacturer?: string;
  titleTerms: string[];
  descriptionTerms: string[];
  applicabilityIdentifiers: string[];
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
