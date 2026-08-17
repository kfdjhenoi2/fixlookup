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

export const deviceCategories: DeviceCategory[] = [
  {
    id: "category-dishwashers",
    slug: "dishwashers",
    name: "Dishwashers",
    singularName: "Dishwasher",
    description:
      "Browse manufacturers, models, symptoms, and error-code records from one structured category.",
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
  overview: `This ${name} index will list model and error-code records only after their identifiers, applicability, and sources are reviewed.`,
}));

export const modelFamilies: ModelFamily[] = [
  {
    id: "family-bosch-demo",
    slug: "demo-family",
    name: "Demo family",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-bosch",
    modelIds: ["model-bosch-example-dw-100"],
    sourceIds: ["source-manufacturer-required"],
    verificationStatus: "demo",
  },
];

export const models: DeviceModel[] = [
  {
    id: "model-bosch-example-dw-100",
    slug: "example-dw-100",
    name: "Example Dishwasher 100",
    modelNumber: "EXAMPLE-DW-100",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-bosch",
    familyId: "family-bosch-demo",
    guideIds: ["guide-demo-starting-check"],
    sourceIds: ["source-manufacturer-required"],
    verificationStatus: "demo",
    isFictional: true,
    note: "This is a fictional record used only to demonstrate the model-page template. It is not a real Bosch model.",
  },
];

export const problems: Problem[] = [
  {
    id: "problem-demo-not-starting",
    slug: "demo-not-starting",
    title: "Demo: dishwasher is not starting",
    categoryId: "category-dishwashers",
    summary:
      "A safe example pathway showing how a symptom guide will be structured after device-specific guidance is verified.",
    symptomLabels: ["No cycle begins", "User-visible message recorded"],
    guideId: "guide-demo-starting-check",
    sourceIds: ["source-manufacturer-required"],
    relatedProblemIds: ["problem-demo-drainage"],
    safetyLevel: "user-safe",
    verificationStatus: "demo",
  },
  {
    id: "problem-demo-drainage",
    slug: "demo-drainage",
    title: "Demo: dishwasher drainage symptom",
    categoryId: "category-dishwashers",
    summary:
      "A placeholder problem record awaiting manufacturer documentation and technical review.",
    symptomLabels: ["Drainage symptom recorded"],
    sourceIds: ["source-manufacturer-required"],
    relatedProblemIds: ["problem-demo-not-starting"],
    safetyLevel: "caution",
    verificationStatus: "needs-review",
  },
];

export const errorCodes: ErrorCode[] = [
  {
    id: "error-bosch-demo-01",
    slug: "demo-01",
    code: "DEMO-01",
    title: "Demo error-code record",
    categoryId: "category-dishwashers",
    manufacturerId: "manufacturer-bosch",
    modelFamilyIds: ["family-bosch-demo"],
    summary:
      "This fictional code has no appliance meaning. It exists only to demonstrate the error-code page structure.",
    guideId: "guide-demo-starting-check",
    sourceIds: ["source-manufacturer-required"],
    verificationStatus: "demo",
    isFictional: true,
  },
];

export const guides: TroubleshootingGuide[] = [
  {
    id: "guide-demo-starting-check",
    slug: "demo-starting-check",
    title: "Demo information-gathering workflow",
    categoryId: "category-dishwashers",
    canonicalProblemId: "problem-demo-not-starting",
    problemIds: ["problem-demo-not-starting"],
    errorCodeIds: ["error-bosch-demo-01"],
    safetyLevel: "user-safe",
    verificationStatus: "demo",
    lastReviewed: null,
    sourceIds: ["source-manufacturer-required"],
    steps: [
      {
        id: "step-record-details",
        title: "Record the visible details",
        instruction:
          "Write down the exact model identifier, visible message, and what happened immediately before the issue. Do not remove any panels.",
        sourceIds: ["source-manufacturer-required"],
        safetyLevel: "user-safe",
      },
      {
        id: "step-check-hazards",
        title: "Look for an obvious safety concern",
        instruction:
          "If there is smoke, a burning smell, visible damage, or water outside the appliance, stop the demo flow and seek qualified help.",
        sourceIds: ["source-manufacturer-required"],
        safetyLevel: "caution",
      },
      {
        id: "step-find-manual",
        title: "Find the official user documentation",
        instruction:
          "Use the recorded model identifier to locate the manufacturer's user manual or support page before attempting any device-specific action.",
        sourceIds: ["source-manufacturer-required"],
        safetyLevel: "user-safe",
      },
    ],
  },
];

export const sources: SourceReference[] = [
  {
    id: "source-manufacturer-required",
    title: "Manufacturer documentation required",
    publisher: "Pending research",
    type: "editorial-placeholder",
    verificationStatus: "needs-review",
    note: "This demo record cannot be treated as technical guidance until a primary source is attached and reviewed.",
  },
];

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
    title: "Verified guidance is the next gate",
    body: "This MVP does not yet contain verified guidance for that identifier. Consult the official user documentation or qualified support.",
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
  {
    id: "search-demo-model",
    label: "Example Dishwasher 100",
    description: "Fictional model-page example",
    type: "Model",
    href: "/dishwashers/bosch/models/example-dw-100",
    keywords: ["EXAMPLE-DW-100", "demo", "model"],
    isDemo: true,
  },
  ...problems.map((problem) => ({
    id: `search-${problem.id}`,
    label: problem.title,
    description: problem.summary,
    type: "Problem" as const,
    href: `/dishwashers/problems/${problem.slug}`,
    keywords: [...problem.symptomLabels, "dishwasher", "problem"],
    isDemo: true,
  })),
  {
    id: "search-demo-error",
    label: "DEMO-01",
    description: "Fictional error-code page example",
    type: "Error code",
    href: "/dishwashers/bosch/error-codes/demo-01",
    keywords: ["code", "error", "demo"],
    isDemo: true,
  },
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
  requireUniqueIdsAndSlugs("guides", guides);
  requireUnique("source IDs", sources, (record) => record.id);
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
    requireUnique(`${guide.id} step IDs`, guide.steps, (step) => step.id);
    for (const step of guide.steps) {
      requireIds(`${guide.id}/${step.id}`, step.sourceIds, sourceIds);
    }
    if (guide.verificationStatus === "verified" && !isGuideIndexable(guide)) {
      errors.push(`${guide.id} is verified but lacks publishable step sources`);
    }
  }

  for (const source of sources) {
    if (
      source.verificationStatus === "verified" &&
      source.type === "editorial-placeholder"
    ) {
      errors.push(`${source.id} cannot verify an editorial placeholder`);
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
