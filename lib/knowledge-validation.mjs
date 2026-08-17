/**
 * Applicability scopes overlap unless at least one populated dimension proves
 * that they cannot describe the same appliance. Empty dimensions are broad;
 * they are never treated as evidence of compatibility.
 *
 * @param {{manufacturerId:string,categoryId:string,marketIds:string[],modelFamilyIds:string[],modelIds:string[],featureTags:string[]}} left
 * @param {{manufacturerId:string,categoryId:string,marketIds:string[],modelFamilyIds:string[],modelIds:string[],featureTags:string[]}} right
 */
export function applicabilityScopesOverlap(left, right) {
  if (left.manufacturerId !== right.manufacturerId || left.categoryId !== right.categoryId) return false;

  const disjoint = (a, b) => a.length > 0 && b.length > 0 && !a.some((value) => b.includes(value));
  return !(
    disjoint(left.marketIds, right.marketIds) ||
    disjoint(left.modelFamilyIds, right.modelFamilyIds) ||
    disjoint(left.modelIds, right.modelIds) ||
    disjoint(left.featureTags, right.featureTags)
  );
}

/**
 * Returns interpretation pairs whose scopes overlap for the same signal. This
 * prevents contradictory meanings from being published without a real market,
 * family, model, or feature boundary.
 *
 * @param {{id:string,signalId:string,applicabilityScopeId:string}[]} interpretations
 * @param {{id:string,manufacturerId:string,categoryId:string,marketIds:string[],modelFamilyIds:string[],modelIds:string[],featureTags:string[]}[]} scopes
 */
export function findOverlappingInterpretations(interpretations, scopes) {
  const scopeById = new Map(scopes.map((scope) => [scope.id, scope]));
  const conflicts = [];

  for (let leftIndex = 0; leftIndex < interpretations.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < interpretations.length; rightIndex += 1) {
      const left = interpretations[leftIndex];
      const right = interpretations[rightIndex];
      if (left.signalId !== right.signalId) continue;
      const leftScope = scopeById.get(left.applicabilityScopeId);
      const rightScope = scopeById.get(right.applicabilityScopeId);
      if (leftScope && rightScope && applicabilityScopesOverlap(leftScope, rightScope)) {
        conflicts.push([left.id, right.id]);
      }
    }
  }

  return conflicts;
}

/**
 * Exact model matching is opt-in. Manufacturer-level scope never silently
 * becomes model compatibility.
 *
 * @param {{id:string,manufacturerId:string,categoryId:string,familyId?:string}} model
 * @param {{manufacturerId:string,categoryId:string,modelFamilyIds:string[],modelIds:string[]}} scope
 */
export function modelIsExplicitlyInScope(model, scope) {
  if (model.manufacturerId !== scope.manufacturerId || model.categoryId !== scope.categoryId) return false;
  return scope.modelIds.includes(model.id) || Boolean(model.familyId && scope.modelFamilyIds.includes(model.familyId));
}
