import assert from "node:assert/strict";
import test from "node:test";
import {
  applicabilityScopesOverlap,
  findOverlappingInterpretations,
  modelIsExplicitlyInScope,
} from "../lib/knowledge-validation.mjs";

const scope = (overrides = {}) => ({
  id: "scope-base",
  kind: "manufacturer-market",
  categoryId: "category-dishwashers",
  manufacturerId: "manufacturer-example",
  marketIds: ["market-us"],
  modelFamilyIds: [],
  modelIds: [],
  featureTags: [],
  exactModelConfirmationRequired: true,
  verificationStatus: "verified",
  ...overrides,
});

test("market and exact-model boundaries prevent false scope overlap", () => {
  assert.equal(applicabilityScopesOverlap(scope(), scope({ id: "uk", marketIds: ["market-uk"] })), false);
  assert.equal(applicabilityScopesOverlap(
    scope({ id: "one", modelIds: ["model-one"] }),
    scope({ id: "two", modelIds: ["model-two"] }),
  ), false);
  assert.equal(applicabilityScopesOverlap(scope(), scope({ id: "broad" })), true);
});

test("overlapping interpretations for one signal are rejected as conflicts", () => {
  const interpretations = [
    { id: "meaning-one", signalId: "signal-1e", applicabilityScopeId: "scope-one" },
    { id: "meaning-two", signalId: "signal-1e", applicabilityScopeId: "scope-two" },
  ];
  assert.deepEqual(
    findOverlappingInterpretations(interpretations, [scope({ id: "scope-one" }), scope({ id: "scope-two" })]),
    [["meaning-one", "meaning-two"]],
  );
  assert.deepEqual(
    findOverlappingInterpretations(interpretations, [scope({ id: "scope-one" }), scope({ id: "scope-two", marketIds: ["market-uk"] })]),
    [],
  );
});

test("manufacturer-level records never imply model compatibility", () => {
  const model = { id: "model-one", manufacturerId: "manufacturer-example", categoryId: "category-dishwashers", familyId: "family-one" };
  assert.equal(modelIsExplicitlyInScope(model, scope()), false);
  assert.equal(modelIsExplicitlyInScope(model, scope({ modelIds: ["model-one"] })), true);
  assert.equal(modelIsExplicitlyInScope(model, scope({ modelFamilyIds: ["family-one"] })), true);
  assert.equal(modelIsExplicitlyInScope(model, scope({ manufacturerId: "manufacturer-other", modelIds: ["model-one"] })), false);
});
