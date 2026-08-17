import assert from "node:assert/strict";
import test from "node:test";
import { compactSearchValue, searchKnowledgeItems } from "../lib/search.mjs";

const item = (overrides) => ({
  id: "base",
  label: "Base record",
  description: "Reviewed record",
  type: "errorCode",
  href: "/en/dishwashers/example/base/",
  identifiers: [],
  aliases: [],
  titleTerms: [],
  descriptionTerms: [],
  applicabilityIdentifiers: [],
  verifiedApplicabilityCombinations: [],
  ...overrides,
});

const records = [
  item({ id: "bosch-e15", label: "Bosch E15", manufacturer: "Bosch", identifiers: ["E15"], href: "/bosch/e15", titleTerms: ["E15 error code"] }),
  item({ id: "whirlpool-f8e4", label: "Whirlpool F8E4", manufacturer: "Whirlpool", identifiers: ["F8E4"], aliases: ["F8 E4"], href: "/whirlpool/f8e4" }),
  item({ id: "electrolux-i20", label: "Electrolux i20", manufacturer: "Electrolux", identifiers: ["i20"], aliases: ["C2", "F2", "AL6"], href: "/electrolux/i20" }),
  item({ id: "samsung-1e", label: "Samsung 1E", manufacturer: "Samsung", identifiers: ["1E"], href: "/samsung/1e" }),
  item({ id: "samsung-5c", label: "Samsung 5C", manufacturer: "Samsung", identifiers: ["5C"], aliases: ["5E"], href: "/samsung/5c" }),
  item({ id: "lg-ie", label: "LG IE", manufacturer: "LG", identifiers: ["IE"], href: "/lg/ie" }),
  item({ id: "model-scoped-e15", label: "Example E15", manufacturer: "Example", identifiers: ["E15"], aliases: ["E17"], applicabilityIdentifiers: ["SHPM88Z75N"], verifiedApplicabilityCombinations: ["SHPM88Z75N E15"], href: "/example/e15" }),
  item({ id: "unscoped-e15", label: "Other E15", manufacturer: "Other", identifiers: ["E15"], href: "/other/e15" }),
  item({ id: "exact-model", type: "model", label: "Bosch SHPM88Z75N", manufacturer: "Bosch", identifiers: ["SHPM88Z75N"], href: "/bosch/models/shpm88z75n" }),
  item({ id: "samsung-exact-model", type: "model", label: "Samsung DW60A6090BB/EF", manufacturer: "Samsung", identifiers: ["DW60A6090BB/EF", "DW60A6090BBEF"], applicabilityIdentifiers: ["4C", "LC"], verifiedApplicabilityCombinations: ["DW60A6090BB/EF 4C", "DW60A6090BB/EF LC"], href: "/samsung/models/dw60a6090bb-ef" }),
  item({ id: "samsung-exact-4c", label: "Samsung 4C", manufacturer: "Samsung", identifiers: ["4C"], aliases: ["4E"], applicabilityIdentifiers: ["DW60A6090BB/EF"], verifiedApplicabilityCombinations: ["DW60A6090BB/EF 4C"], href: "/samsung/4c" }),
  item({ id: "drain-problem", type: "problem", label: "Dishwasher not draining", titleTerms: ["standing water", "not draining"], descriptionTerms: ["water remains after a cycle"], href: "/problems/drain" }),
];

test("code normalization tolerates spaces and punctuation", () => {
  assert.equal(compactSearchValue("F8-E4"), "f8e4");
  assert.equal(compactSearchValue("Ｅ１５"), "e15");
  for (const query of ["E15", "E 15", "Bosch E15", "Bosch E 15"]) {
    assert.equal(searchKnowledgeItems(records, query)[0]?.id, "bosch-e15", query);
  }
  for (const query of ["F8E4", "F8 E4", "F8-E4", "Whirlpool F8 E4"]) {
    assert.equal(searchKnowledgeItems(records, query)[0]?.id, "whirlpool-f8e4", query);
  }
  assert.equal(searchKnowledgeItems(records, "Electrolux AL6")[0]?.id, "electrolux-i20");
  assert.equal(searchKnowledgeItems(records, "Electrolux i20")[0]?.id, "electrolux-i20");
  assert.equal(searchKnowledgeItems(records, "Samsung 5E")[0]?.id, "samsung-5c");
  assert.equal(searchKnowledgeItems(records, "SHPM88Z75N")[0]?.id, "exact-model");
});

test("model-qualified error queries require explicit applicability", () => {
  const results = searchKnowledgeItems(records, "SHPM88Z75N E15");
  assert.deepEqual(results.map((record) => record.id), ["model-scoped-e15"]);
  assert.ok(!results.some((record) => record.id === "unscoped-e15"));
  assert.deepEqual(searchKnowledgeItems(records, "SHPM88Z75N Z99"), []);
  assert.deepEqual(searchKnowledgeItems(records, "SHPM88Z75N E17"), [], "an unverified alias must not inherit exact-model applicability");
});

test("exact model suffixes and verified code identifiers survive tolerant search", () => {
  assert.equal(searchKnowledgeItems(records, "DW60A6090BB-EF")[0]?.id, "samsung-exact-model");
  assert.ok(searchKnowledgeItems(records, "Samsung DW60A6090BB/EF 4C").some((record) => record.id === "samsung-exact-4c"));
  assert.deepEqual(searchKnowledgeItems(records, "DW60A6090BB/EF 4E"), [], "4E is not verified for this exact model");
  assert.deepEqual(searchKnowledgeItems(records, "DW60A6090BB 4C"), [], "a missing market suffix must not inherit the exact relationship");
});

test("manufacturer context disambiguates visually similar codes", () => {
  assert.deepEqual(searchKnowledgeItems(records, "Samsung 1E").map((record) => record.id), ["samsung-1e"]);
  assert.deepEqual(searchKnowledgeItems(records, "LG IE").map((record) => record.id), ["lg-ie"]);
});

test("one signal record returns once even when it can have many interpretations", () => {
  const ambiguousSignal = item({
    id: "samsung-1e-shared-signal",
    label: "Samsung 1E",
    manufacturer: "Samsung",
    identifiers: ["1E"],
    aliases: ["1 E", "1-E"],
  });
  assert.deepEqual(searchKnowledgeItems([ambiguousSignal], "Samsung 1 E").map((record) => record.id), [ambiguousSignal.id]);
});

test("symptom terms match while unrelated text returns no result", () => {
  assert.equal(searchKnowledgeItems(records, "not draining")[0]?.id, "drain-problem");
  assert.deepEqual(searchKnowledgeItems(records, "refrigerator compressor"), []);
});
