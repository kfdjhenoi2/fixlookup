import type {
  ApplicabilityScopeKnowledge,
  EvidenceClaimKnowledge,
  ErrorInterpretationKnowledge,
  ErrorSignalKnowledge,
  SafetyLevel,
  VerificationStatus,
} from "../../types";
import { dishwasherCategoryId } from "./constants";

export interface ErrorDefinition {
  id: string;
  code: string;
  aliases?: string[];
  signalIds?: string[];
  manufacturerId: string;
  marketIds: string[];
  sourceIds: string[];
  problemIds: string[];
  guideIds: string[];
  safetyLevel: SafetyLevel;
  featureTags?: string[];
  exactModelConfirmationRequired?: boolean;
  verificationStatus?: VerificationStatus;
}

export function buildErrorRecords(definitions: ErrorDefinition[]) {
  const signals: ErrorSignalKnowledge[] = [];
  const interpretations: ErrorInterpretationKnowledge[] = [];
  const applicabilityScopes: ApplicabilityScopeKnowledge[] = [];
  const evidenceClaims: EvidenceClaimKnowledge[] = [];

  definitions.forEach((definition) => {
    const verificationStatus = definition.verificationStatus ?? "verified";
    const scopeId = `scope-${definition.id.replace(/^error-/, "")}`;
    const interpretationId = `interpretation-${definition.id.replace(/^error-/, "")}`;
    const signalClaimId = `claim-${definition.id.replace(/^error-/, "")}-signal`;
    const meaningClaimId = `claim-${definition.id.replace(/^error-/, "")}-meaning`;
    const scopeClaimId = `claim-${definition.id.replace(/^error-/, "")}-scope`;

    signals.push({
      id: definition.id,
      code: definition.code,
      aliases: definition.aliases ?? [],
      signalIds: definition.signalIds ?? [],
      categoryId: dishwasherCategoryId,
      manufacturerId: definition.manufacturerId,
      evidenceClaimIds: [signalClaimId],
      verificationStatus,
      isFictional: false,
    });
    applicabilityScopes.push({
      id: scopeId,
      kind: definition.featureTags?.length ? "feature" : "manufacturer-market",
      categoryId: dishwasherCategoryId,
      manufacturerId: definition.manufacturerId,
      marketIds: definition.marketIds,
      modelFamilyIds: [],
      modelIds: [],
      featureTags: definition.featureTags ?? [],
      exactModelConfirmationRequired: definition.exactModelConfirmationRequired ?? true,
      verificationStatus,
    });
    interpretations.push({
      id: interpretationId,
      signalId: definition.id,
      problemIds: definition.problemIds,
      guideIds: definition.guideIds,
      applicabilityScopeId: scopeId,
      evidenceClaimIds: [meaningClaimId, scopeClaimId],
      safetyLevel: definition.safetyLevel,
      verificationStatus,
    });
    evidenceClaims.push(
      {
        id: signalClaimId,
        kind: "error-signal",
        sourceIds: definition.sourceIds,
        applicabilityScopeId: scopeId,
        verificationStatus,
      },
      {
        id: meaningClaimId,
        kind: "error-meaning",
        sourceIds: definition.sourceIds,
        applicabilityScopeId: scopeId,
        verificationStatus,
      },
      {
        id: scopeClaimId,
        kind: "applicability",
        sourceIds: definition.sourceIds,
        applicabilityScopeId: scopeId,
        verificationStatus,
      },
    );
  });

  return { signals, interpretations, applicabilityScopes, evidenceClaims };
}

