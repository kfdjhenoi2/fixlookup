export type VerificationStatus = "demo" | "needs-review" | "verified";

export type SafetyLevel = "user-safe" | "caution" | "professional-only";

export interface DeviceCategory {
  id: string;
  slug: string;
  name: string;
  singularName: string;
  description: string;
  manufacturerIds: string[];
}

export interface Manufacturer {
  id: string;
  slug: string;
  name: string;
  categoryIds: string[];
  overview: string;
}

export interface ModelFamily {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  manufacturerId: string;
  modelIds: string[];
  sourceIds: string[];
  verificationStatus: VerificationStatus;
}

export interface DeviceModel {
  id: string;
  slug: string;
  name: string;
  modelNumber: string;
  categoryId: string;
  manufacturerId: string;
  familyId: string;
  guideIds: string[];
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  isFictional: boolean;
  note: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  summary: string;
  symptomLabels: string[];
  guideId?: string;
  sourceIds: string[];
  relatedProblemIds: string[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
}

export interface ErrorCode {
  id: string;
  slug: string;
  code: string;
  aliases: string[];
  title: string;
  categoryId: string;
  manufacturerId: string;
  modelFamilyIds: string[];
  summary: string;
  sourceScope: string;
  applicabilityNote: string;
  guideId?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  isFictional: boolean;
}

export interface TroubleshootingStep {
  id: string;
  title: string;
  instruction: string;
  sourceIds: string[];
  safetyLevel: SafetyLevel;
}

export interface TroubleshootingGuide {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  canonicalProblemId: string;
  problemIds: string[];
  errorCodeIds: string[];
  steps: TroubleshootingStep[];
  sourceIds: string[];
  safetyLevel: SafetyLevel;
  verificationStatus: VerificationStatus;
  lastReviewed: string | null;
}

export type SourceType =
  | "manufacturer-manual"
  | "manufacturer-support"
  | "official-service-document"
  | "reputable-technical"
  | "editorial-placeholder";

export interface SourceReference {
  id: string;
  title: string;
  publisher: string;
  type: SourceType;
  url?: string;
  publishedAt?: string;
  accessedAt?: string;
  verificationStatus: VerificationStatus;
  note?: string;
}

export interface SearchItem {
  id: string;
  label: string;
  description: string;
  type: "Device" | "Manufacturer" | "Model" | "Problem" | "Error code";
  href: string;
  keywords: string[];
  isDemo?: boolean;
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
