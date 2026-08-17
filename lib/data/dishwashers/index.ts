import { boschErrors } from "./bosch/errors";
import { electroluxErrors } from "./electrolux/errors";
import { lgErrors } from "./lg/errors";
import { samsungErrors } from "./samsung/errors";
import { siemensErrors } from "./siemens/errors";
import { sharedEvidenceClaimKnowledge } from "./shared";
import { whirlpoolErrors } from "./whirlpool/errors";

export {
  categoryKnowledge,
  manufacturerKnowledge,
  marketKnowledge,
  modelFamilyKnowledge,
  modelKnowledge,
  troubleshooterKnowledge,
} from "./core";
export { sourceKnowledge } from "./sources";
export { guideKnowledge, problemKnowledge } from "./shared";

const manufacturerErrors = [
  boschErrors,
  siemensErrors,
  electroluxErrors,
  whirlpoolErrors,
  samsungErrors,
  lgErrors,
];

export const errorSignalKnowledge = manufacturerErrors.flatMap((records) => records.signals);
export const errorInterpretationKnowledge = manufacturerErrors.flatMap((records) => records.interpretations);
export const applicabilityScopeKnowledge = manufacturerErrors.flatMap((records) => records.applicabilityScopes);
export const evidenceClaimKnowledge = [
  ...manufacturerErrors.flatMap((records) => records.evidenceClaims),
  ...sharedEvidenceClaimKnowledge,
];

