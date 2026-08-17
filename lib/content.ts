import type {
  DeviceCategory,
  DeviceModel,
  ErrorCode,
  Manufacturer,
  ModelFamily,
  Problem,
  SearchItem,
  SourceReference,
  TroubleshooterNode,
  TroubleshootingGuide,
} from "./types";
import {
  dishwasherErrorCodes,
  dishwasherGuides,
  dishwasherModelFamilies,
  dishwasherModels,
  dishwasherProblems,
} from "./data/dishwasher-content";
import { dishwasherSources } from "./data/dishwasher-sources";

export const deviceCategories: DeviceCategory[] = [
  {
    id: "category-dishwashers",
    slug: "dishwashers",
    name: "Dishwashers",
    singularName: "Dishwasher",
    description:
      "Browse source-reviewed dishwasher symptoms and manufacturer error-code records from one structured category.",
    manufacturerIds: [
      "manufacturer-bosch",
      "manufacturer-siemens",
      "manufacturer-electrolux",
      "manufacturer-whirlpool",
      "manufacturer-samsung",
    ],
  },
];

export const manufacturers: Manufacturer[] = [
  "Bosch",
  "Siemens",
  "Electrolux",
  "Whirlpool",
  "Samsung",
].map((name) => ({
  id: `manufacturer-${name.toLowerCase()}`,
  slug: name.toLowerCase(),
  name,
  categoryIds: ["category-dishwashers"],
  overview: `This ${name} index publishes error-code records only when their meaning, source scope, and evidence have been reviewed. Model compatibility is never inferred.`,
}));

export const modelFamilies: ModelFamily[] = dishwasherModelFamilies;

export const models: DeviceModel[] = dishwasherModels;

export const problems: Problem[] = dishwasherProblems;

export const errorCodes: ErrorCode[] = dishwasherErrorCodes;

export const guides: TroubleshootingGuide[] = dishwasherGuides;

export const sources: SourceReference[] = dishwasherSources;

export const troubleshooterNodes: TroubleshooterNode[] = [
  {
    id: "start",
    kind: "question",
    eyebrow: "Step 1 of 3",
    title: "Is there an immediate safety concern?",
    body: "Choose yes if you notice smoke, a burning smell, visible damage, or water outside the appliance.",
    safetyLevel: "caution",
    options: [
      { label: "Yes, something looks unsafe", nextNodeId: "stop" },
      { label: "No obvious safety concern", nextNodeId: "details" },
    ],
  },
  {
    id: "details",
    kind: "question",
    eyebrow: "Step 2 of 3",
    title: "Have you recorded the exact model and message?",
    body: "The framework uses exact identifiers to connect a device to reviewed guidance without guessing.",
    safetyLevel: "user-safe",
    options: [
      { label: "Yes, I have both", nextNodeId: "sources" },
      { label: "Not yet", nextNodeId: "record" },
    ],
  },
  {
    id: "record",
    kind: "outcome",
    eyebrow: "Safe next step",
    title: "Record the label and display",
    body: "Copy the visible model identifier and any message exactly as shown. Do not open panels or access internal components.",
    safetyLevel: "user-safe",
  },
  {
    id: "sources",
    kind: "outcome",
    eyebrow: "Step 3 of 3",
    title: "Match the identifier to reviewed guidance",
    body: "Search the verified problem and error-code records, then confirm any manufacturer-specific instruction in the official manual for the exact model.",
    safetyLevel: "user-safe",
  },
  {
    id: "stop",
    kind: "outcome",
    eyebrow: "Stop here",
    title: "Do not continue troubleshooting",
    body: "Avoid using or opening the appliance. Follow the manufacturer's safety guidance and contact qualified support.",
    safetyLevel: "professional-only",
  },
];

export const searchItems: SearchItem[] = [
  {
    id: "search-dishwashers",
    label: "Dishwashers",
    description: "Browse the first device category",
    type: "Device",
    href: "/dishwashers",
    keywords: ["dishwasher", "appliance", "device"],
  },
  ...manufacturers.map((manufacturer) => ({
    id: `search-${manufacturer.id}`,
    label: `${manufacturer.name} dishwashers`,
    description: "Browse the manufacturer index",
    type: "Manufacturer" as const,
    href: `/dishwashers/${manufacturer.slug}`,
    keywords: [manufacturer.name, "dishwasher", "brand"],
  })),
  ...models.map((model) => {
    const manufacturer = manufacturers.find(
      (candidate) => candidate.id === model.manufacturerId,
    );
    return {
      id: `search-${model.id}`,
      label: model.name,
      description: model.modelNumber,
      type: "Model" as const,
      href: `/dishwashers/${manufacturer?.slug ?? "unknown"}/models/${model.slug}`,
      keywords: [model.modelNumber, model.name, "dishwasher", "model"],
      isDemo: model.verificationStatus !== "verified" || model.isFictional,
    };
  }),
  ...problems.map((problem) => ({
    id: `search-${problem.id}`,
    label: problem.title,
    description: problem.summary,
    type: "Problem" as const,
    href: `/dishwashers/problems/${problem.slug}`,
    keywords: [...problem.symptomLabels, "dishwasher", "problem"],
    isDemo: problem.verificationStatus !== "verified",
  })),
  ...errorCodes.map((errorCode) => {
    const manufacturer = manufacturers.find(
      (candidate) => candidate.id === errorCode.manufacturerId,
    );
    return {
      id: `search-${errorCode.id}`,
      label: `${manufacturer?.name ?? "Dishwasher"} ${errorCode.code}`,
      description: errorCode.title,
      type: "Error code" as const,
      href: `/dishwashers/${manufacturer?.slug ?? "unknown"}/error-codes/${errorCode.slug}`,
      keywords: [
        errorCode.code,
        ...errorCode.aliases,
        manufacturer?.name ?? "",
        "dishwasher",
        "error code",
      ],
      isDemo:
        errorCode.verificationStatus !== "verified" || errorCode.isFictional,
    };
  }),
];

export const getCategoryBySlug = (slug: string) =>
  deviceCategories.find((category) => category.slug === slug);

export const getManufacturerBySlug = (slug: string) =>
  manufacturers.find((manufacturer) => manufacturer.slug === slug);

export const getManufacturerById = (id: string) =>
  manufacturers.find((manufacturer) => manufacturer.id === id);

export const getModelBySlug = (manufacturerId: string, slug: string) =>
  models.find(
    (model) => model.manufacturerId === manufacturerId && model.slug === slug,
  );

export const getProblemBySlug = (slug: string) =>
  problems.find((problem) => problem.slug === slug);

export const getProblemById = (id: string) =>
  problems.find((problem) => problem.id === id);

export const getErrorCodeBySlug = (manufacturerId: string, slug: string) =>
  errorCodes.find(
    (errorCode) =>
      errorCode.manufacturerId === manufacturerId && errorCode.slug === slug,
  );

export const getGuideById = (id?: string) =>
  guides.find((guide) => guide.id === id);

export const getSourcesByIds = (ids: string[]) =>
  sources.filter((source) => ids.includes(source.id));

export const getRelatedProblems = (problem: Problem) =>
  problems.filter((candidate) =>
    problem.relatedProblemIds.includes(candidate.id),
  );

function hasVerifiedSources(sourceIds: string[]) {
  return (
    sourceIds.length > 0 &&
    sourceIds.every((sourceId) => {
      const source = sources.find((candidate) => candidate.id === sourceId);
      return (
        source?.verificationStatus === "verified" &&
        source.type !== "editorial-placeholder"
      );
    })
  );
}

export const isGuideIndexable = (guide: TroubleshootingGuide) =>
  guide.verificationStatus === "verified" &&
  hasVerifiedSources(guide.sourceIds) &&
  guide.steps.every((step) => hasVerifiedSources(step.sourceIds));

export const isModelFamilyIndexable = (family: ModelFamily) =>
  family.verificationStatus === "verified" &&
  hasVerifiedSources(family.sourceIds);

export const isModelIndexable = (model: DeviceModel) => {
  const family = modelFamilies.find((candidate) => candidate.id === model.familyId);
  const linkedGuides = model.guideIds.map((guideId) => getGuideById(guideId));
  return (
    model.verificationStatus === "verified" &&
    !model.isFictional &&
    hasVerifiedSources(model.sourceIds) &&
    Boolean(family && isModelFamilyIndexable(family)) &&
    linkedGuides.every((guide) => Boolean(guide && isGuideIndexable(guide)))
  );
};

export const isProblemIndexable = (problem: Problem) => {
  const guide = getGuideById(problem.guideId);
  return (
    problem.verificationStatus === "verified" &&
    hasVerifiedSources(problem.sourceIds) &&
    (!guide || isGuideIndexable(guide))
  );
};

export const isErrorCodeIndexable = (errorCode: ErrorCode) => {
  const linkedFamilies = errorCode.modelFamilyIds.map((familyId) =>
    modelFamilies.find((candidate) => candidate.id === familyId),
  );
  const guide = getGuideById(errorCode.guideId);
  return (
    errorCode.verificationStatus === "verified" &&
    !errorCode.isFictional &&
    hasVerifiedSources(errorCode.sourceIds) &&
    linkedFamilies.every((family) =>
      Boolean(family && isModelFamilyIndexable(family)),
    ) &&
    (!errorCode.guideId || Boolean(guide && isGuideIndexable(guide)))
  );
};

export const manufacturerHasIndexableContent = (manufacturerId: string) =>
  models.some(
    (model) =>
      model.manufacturerId === manufacturerId && isModelIndexable(model),
  ) ||
  errorCodes.some(
    (errorCode) =>
      errorCode.manufacturerId === manufacturerId &&
      isErrorCodeIndexable(errorCode),
  );

function validateContentRelationships() {
  const errors: string[] = [];
  const ids = <T extends { id: string }>(records: T[]) =>
    new Set(records.map((record) => record.id));
  const categoryIds = ids(deviceCategories);
  const manufacturerIds = ids(manufacturers);
  const familyIds = ids(modelFamilies);
  const modelIds = ids(models);
  const problemIds = ids(problems);
  const errorCodeIds = ids(errorCodes);
  const guideIds = ids(guides);
  const sourceIds = ids(sources);

  const requireUnique = <T>(
    owner: string,
    records: T[],
    getKey: (record: T) => string,
  ) => {
    const seen = new Set<string>();
    for (const record of records) {
      const key = getKey(record);
      if (seen.has(key)) errors.push(`${owner} has duplicate key ${key}`);
      seen.add(key);
    }
  };

  const requireUniqueIdsAndSlugs = <T extends { id: string; slug: string }>(
    owner: string,
    records: T[],
  ) => {
    requireUnique(`${owner} IDs`, records, (record) => record.id);
    requireUnique(`${owner} slugs`, records, (record) => record.slug);
  };

  requireUniqueIdsAndSlugs("device categories", deviceCategories);
  requireUniqueIdsAndSlugs("manufacturers", manufacturers);
  requireUnique("model family IDs", modelFamilies, (record) => record.id);
  requireUnique("model family route keys", modelFamilies, (record) =>
    `${record.manufacturerId}:${record.slug}`,
  );
  requireUnique("model IDs", models, (record) => record.id);
  requireUnique("model route keys", models, (record) =>
    `${record.manufacturerId}:${record.slug}`,
  );
  requireUnique("model identifiers", models, (record) =>
    `${record.manufacturerId}:${record.modelNumber.toLowerCase()}`,
  );
  requireUniqueIdsAndSlugs("problems", problems);
  requireUnique("error-code IDs", errorCodes, (record) => record.id);
  requireUnique("error-code route keys", errorCodes, (record) =>
    `${record.manufacturerId}:${record.slug}`,
  );
  requireUnique("error-code identifiers", errorCodes, (record) =>
    `${record.manufacturerId}:${record.code.toLowerCase()}`,
  );
  requireUnique(
    "error-code and alias identifiers",
    errorCodes.flatMap((record) =>
      [record.code, ...record.aliases].map((identifier) => ({
        manufacturerId: record.manufacturerId,
        identifier,
      })),
    ),
    (record) =>
      `${record.manufacturerId}:${record.identifier.toLowerCase().trim()}`,
  );
  requireUniqueIdsAndSlugs("guides", guides);
  requireUnique("source IDs", sources, (record) => record.id);
  requireUnique(
    "source URLs",
    sources.filter((source) => source.url),
    (source) => source.url!.toLowerCase(),
  );
  requireUnique("search item IDs", searchItems, (record) => record.id);
  requireUnique("troubleshooter node IDs", troubleshooterNodes, (record) => record.id);

  const requireIds = (
    owner: string,
    values: string[],
    available: Set<string>,
  ) => {
    for (const value of values) {
      if (!available.has(value)) errors.push(`${owner} references missing ${value}`);
    }
  };

  for (const category of deviceCategories) {
    requireIds(category.id, category.manufacturerIds, manufacturerIds);
    for (const manufacturerId of category.manufacturerIds) {
      const manufacturer = manufacturers.find(
        (candidate) => candidate.id === manufacturerId,
      );
      if (manufacturer && !manufacturer.categoryIds.includes(category.id)) {
        errors.push(`${manufacturer.id} is missing ${category.id}`);
      }
    }
  }
  for (const manufacturer of manufacturers) {
    requireIds(manufacturer.id, manufacturer.categoryIds, categoryIds);
    for (const categoryId of manufacturer.categoryIds) {
      const category = deviceCategories.find(
        (candidate) => candidate.id === categoryId,
      );
      if (category && !category.manufacturerIds.includes(manufacturer.id)) {
        errors.push(`${category.id} is missing ${manufacturer.id}`);
      }
    }
  }
  for (const family of modelFamilies) {
    requireIds(family.id, [family.categoryId], categoryIds);
    requireIds(family.id, [family.manufacturerId], manufacturerIds);
    requireIds(family.id, family.modelIds, modelIds);
    requireIds(family.id, family.sourceIds, sourceIds);
    for (const modelId of family.modelIds) {
      const model = models.find((candidate) => candidate.id === modelId);
      if (model && (model.familyId !== family.id || model.categoryId !== family.categoryId || model.manufacturerId !== family.manufacturerId)) {
        errors.push(`${family.id} is inconsistent with ${model.id}`);
      }
    }
    if (
      family.verificationStatus === "verified" &&
      !isModelFamilyIndexable(family)
    ) {
      errors.push(`${family.id} is verified but lacks publishable sources`);
    }
  }
  for (const model of models) {
    requireIds(model.id, [model.categoryId], categoryIds);
    requireIds(model.id, [model.manufacturerId], manufacturerIds);
    requireIds(model.id, [model.familyId], familyIds);
    requireIds(model.id, model.guideIds, guideIds);
    requireIds(model.id, model.sourceIds, sourceIds);
    const family = modelFamilies.find((candidate) => candidate.id === model.familyId);
    if (family && !family.modelIds.includes(model.id)) {
      errors.push(`${model.id} is missing from ${family.id}.modelIds`);
    }
    if (model.verificationStatus === "verified" && !isModelIndexable(model)) {
      errors.push(`${model.id} is verified but lacks publishable sources or identity`);
    }
  }
  for (const problem of problems) {
    requireIds(problem.id, [problem.categoryId], categoryIds);
    requireIds(problem.id, problem.relatedProblemIds, problemIds);
    requireIds(problem.id, problem.sourceIds, sourceIds);
    if (problem.guideId) requireIds(problem.id, [problem.guideId], guideIds);
    if (problem.guideId) {
      const guide = guides.find((candidate) => candidate.id === problem.guideId);
      if (guide && !guide.problemIds.includes(problem.id)) {
        errors.push(`${problem.id} is missing from ${guide.id}.problemIds`);
      }
    }
    if (problem.verificationStatus === "verified" && !isProblemIndexable(problem)) {
      errors.push(`${problem.id} is verified but lacks publishable sources`);
    }
  }
  for (const errorCode of errorCodes) {
    requireIds(errorCode.id, [errorCode.categoryId], categoryIds);
    requireIds(errorCode.id, [errorCode.manufacturerId], manufacturerIds);
    requireIds(errorCode.id, errorCode.modelFamilyIds, familyIds);
    requireIds(errorCode.id, errorCode.sourceIds, sourceIds);
    if (errorCode.guideId) requireIds(errorCode.id, [errorCode.guideId], guideIds);
    if (errorCode.guideId) {
      const guide = guides.find((candidate) => candidate.id === errorCode.guideId);
      if (guide && !guide.errorCodeIds.includes(errorCode.id)) {
        errors.push(`${errorCode.id} is missing from ${guide.id}.errorCodeIds`);
      }
    }
    if (!errorCode.sourceScope.trim()) {
      errors.push(`${errorCode.id} is missing source scope`);
    }
    if (!errorCode.applicabilityNote.trim()) {
      errors.push(`${errorCode.id} is missing an applicability note`);
    }
    if (
      errorCode.verificationStatus === "verified" &&
      !isErrorCodeIndexable(errorCode)
    ) {
      errors.push(`${errorCode.id} is verified but lacks publishable sources or identity`);
    }
  }
  for (const guide of guides) {
    requireIds(guide.id, [guide.categoryId], categoryIds);
    requireIds(guide.id, guide.problemIds, problemIds);
    requireIds(guide.id, [guide.canonicalProblemId], problemIds);
    requireIds(guide.id, guide.errorCodeIds, errorCodeIds);
    requireIds(guide.id, guide.sourceIds, sourceIds);
    if (!guide.problemIds.includes(guide.canonicalProblemId)) {
      errors.push(`${guide.id}.canonicalProblemId must be included in problemIds`);
    }
    for (const problemId of guide.problemIds) {
      const problem = problems.find((candidate) => candidate.id === problemId);
      if (problem && problem.guideId !== guide.id) {
        errors.push(`${guide.id} is not the guide assigned by ${problem.id}`);
      }
    }
    for (const errorCodeId of guide.errorCodeIds) {
      const errorCode = errorCodes.find(
        (candidate) => candidate.id === errorCodeId,
      );
      if (errorCode && errorCode.guideId !== guide.id) {
        errors.push(`${guide.id} is not the guide assigned by ${errorCode.id}`);
      }
    }
    requireUnique(`${guide.id} step IDs`, guide.steps, (step) => step.id);
    for (const step of guide.steps) {
      requireIds(`${guide.id}/${step.id}`, step.sourceIds, sourceIds);
      for (const sourceId of step.sourceIds) {
        if (!guide.sourceIds.includes(sourceId)) {
          errors.push(`${guide.id}/${step.id} uses ${sourceId} outside guide.sourceIds`);
        }
      }
    }
    if (guide.verificationStatus === "verified" && !isGuideIndexable(guide)) {
      errors.push(`${guide.id} is verified but lacks publishable step sources`);
    }
    if (guide.verificationStatus === "verified" && !guide.lastReviewed) {
      errors.push(`${guide.id} is verified but has no review date`);
    }
  }

  for (const source of sources) {
    if (
      source.verificationStatus === "verified" &&
      source.type === "editorial-placeholder"
    ) {
      errors.push(`${source.id} cannot verify an editorial placeholder`);
    }
    if (
      source.verificationStatus === "verified" &&
      (!source.url || !source.url.startsWith("https://"))
    ) {
      errors.push(`${source.id} is verified but has no secure source URL`);
    }
  }

  const referencedSourceIds = new Set([
    ...modelFamilies.flatMap((family) => family.sourceIds),
    ...models.flatMap((model) => model.sourceIds),
    ...problems.flatMap((problem) => problem.sourceIds),
    ...errorCodes.flatMap((errorCode) => errorCode.sourceIds),
    ...guides.flatMap((guide) => [
      ...guide.sourceIds,
      ...guide.steps.flatMap((step) => step.sourceIds),
    ]),
  ]);
  for (const source of sources) {
    if (!referencedSourceIds.has(source.id)) {
      errors.push(`${source.id} is not referenced by any content record`);
    }
  }

  for (const item of searchItems) {
    if (!item.href.startsWith("/")) errors.push(`${item.id} has a non-local href`);
  }

  const troubleshooterNodeIds = ids(troubleshooterNodes);
  if (!troubleshooterNodeIds.has("start")) {
    errors.push("troubleshooter is missing the start node");
  }
  for (const node of troubleshooterNodes) {
    if (node.kind === "question") {
      if (!node.options.length) errors.push(`${node.id} has no options`);
      requireIds(
        node.id,
        node.options.map((option) => option.nextNodeId),
        troubleshooterNodeIds,
      );
    }
  }

  if (errors.length) {
    throw new Error(`Invalid FixOrReplace content relationships:\n${errors.join("\n")}`);
  }
}

validateContentRelationships();
