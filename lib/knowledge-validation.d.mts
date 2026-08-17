import type { ApplicabilityScopeKnowledge, DeviceModelKnowledge, ErrorInterpretationKnowledge } from "./types";

export function applicabilityScopesOverlap(
  left: ApplicabilityScopeKnowledge,
  right: ApplicabilityScopeKnowledge,
): boolean;

export function findOverlappingInterpretations(
  interpretations: ErrorInterpretationKnowledge[],
  scopes: ApplicabilityScopeKnowledge[],
): Array<[string, string]>;

export function modelIsExplicitlyInScope(
  model: DeviceModelKnowledge,
  scope: ApplicabilityScopeKnowledge,
): boolean;
