import type {
  ApplicabilityScopeKnowledge,
  EvidenceClaimKnowledge,
  ErrorInterpretationKnowledge,
  ErrorSignalKnowledge,
  DeviceModelKnowledge,
  ModelErrorRelationshipKnowledge,
  ModelIndexabilityClass,
  ModelProblemRelationshipKnowledge,
  ModelPublicationStatus,
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

interface ModelErrorDefinition {
  interpretationId: string;
  verifiedIdentifiers: string[];
}

export interface ModelDefinition {
  id: string;
  modelNumber: string;
  manufacturerId: string;
  marketIds: string[];
  identitySourceIds: string[];
  manualSourceIds: string[];
  relationshipSourceIds?: string[];
  problemIds?: string[];
  errors?: ModelErrorDefinition[];
  officialAliases?: string[];
  familyId?: string;
  indexabilityClass: ModelIndexabilityClass;
  publicationStatus: ModelPublicationStatus;
}

const normalizeModelIdentifier = (identifier: string) =>
  identifier.normalize("NFKC").toLocaleUpperCase("en-US").replace(/[^A-Z0-9]/g, "");

export function buildModelRecords(definitions: ModelDefinition[]) {
  const models: DeviceModelKnowledge[] = [];
  const errorRelationships: ModelErrorRelationshipKnowledge[] = [];
  const problemRelationships: ModelProblemRelationshipKnowledge[] = [];
  const evidenceClaims: EvidenceClaimKnowledge[] = [];

  definitions.forEach((definition) => {
    const key = definition.id.replace(/^model-/, "");
    const identityClaimId = `claim-${key}-identity`;
    const manualClaimId = `claim-${key}-manual`;
    const manualClaimIds = definition.manualSourceIds.length ? [manualClaimId] : [];
    const relationshipSourceIds = definition.relationshipSourceIds ?? definition.manualSourceIds;

    evidenceClaims.push({
      id: identityClaimId,
      kind: "model-identity",
      sourceIds: definition.identitySourceIds,
      verificationStatus: "verified",
    });
    if (definition.manualSourceIds.length) {
      evidenceClaims.push({
        id: manualClaimId,
        kind: "model-documentation",
        sourceIds: relationshipSourceIds,
        verificationStatus: "verified",
      });
    }

    models.push({
      id: definition.id,
      modelNumber: definition.modelNumber,
      normalizedSearchIdentifier: normalizeModelIdentifier(definition.modelNumber),
      officialAliases: definition.officialAliases ?? [],
      categoryId: dishwasherCategoryId,
      manufacturerId: definition.manufacturerId,
      marketIds: definition.marketIds,
      familyId: definition.familyId,
      evidenceClaimIds: [identityClaimId, ...manualClaimIds],
      identityClaimIds: [identityClaimId],
      manualClaimIds,
      indexabilityClass: definition.indexabilityClass,
      publicationStatus: definition.publicationStatus,
      verificationStatus: "verified",
      isFictional: false,
    });

    (definition.problemIds ?? []).forEach((problemId) => {
      const problemKey = problemId.replace(/^problem-/, "");
      const claimId = `claim-${key}-${problemKey}`;
      evidenceClaims.push({
        id: claimId,
        kind: "model-relationship",
        sourceIds: relationshipSourceIds,
        verificationStatus: "verified",
      });
      problemRelationships.push({
        id: `relationship-${key}-${problemKey}`,
        modelId: definition.id,
        problemId,
        evidenceClaimIds: [claimId],
        verificationStatus: "verified",
      });
    });

    (definition.errors ?? []).forEach(({ interpretationId, verifiedIdentifiers }) => {
      const signalKey = interpretationId.replace(/^interpretation-/, "");
      const claimId = `claim-${key}-${signalKey}`;
      evidenceClaims.push({
        id: claimId,
        kind: "model-relationship",
        sourceIds: definition.manualSourceIds,
        verificationStatus: "verified",
      });
      errorRelationships.push({
        id: `relationship-${key}-${signalKey}`,
        modelId: definition.id,
        interpretationId,
        verifiedIdentifiers,
        evidenceClaimIds: [claimId],
        verificationStatus: "verified",
      });
    });
  });

  return { models, errorRelationships, problemRelationships, evidenceClaims };
}
