import {
  categoryKnowledge,
  errorCodeKnowledge,
  guideKnowledge,
  manufacturerKnowledge,
  modelFamilyKnowledge,
  modelKnowledge,
  problemKnowledge,
  sourceKnowledge,
  troubleshooterKnowledge,
} from "./data/dishwasher-knowledge";
import { getLocaleContent } from "./i18n";
import type { Locale } from "./i18n/config";
import { paths } from "./i18n/routing";
import { formatMessage } from "./i18n/messages";
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

function required<T>(value: T | undefined, label: string): T {
  if (!value) throw new Error(`Missing localization: ${label}`);
  return value;
}

export function getContent(locale: Locale) {
  const messages = getLocaleContent(locale);
  const deviceCategories: DeviceCategory[] = categoryKnowledge.map((record) => ({
    ...record,
    ...required(messages.categories[record.id], record.id),
  }));
  const manufacturers: Manufacturer[] = manufacturerKnowledge.map((record) => ({
    ...record,
    ...required(messages.manufacturers[record.id], record.id),
  }));
  const modelFamilies: ModelFamily[] = modelFamilyKnowledge.map((record) => ({
    ...record,
    ...required(messages.modelFamilies[record.id], record.id),
  }));
  const models: DeviceModel[] = modelKnowledge.map((record) => ({
    ...record,
    ...required(messages.models[record.id], record.id),
  }));
  const problems: Problem[] = problemKnowledge.map((record) => ({
    ...record,
    ...required(messages.problems[record.id], record.id),
  }));
  const errorCodes: ErrorCode[] = errorCodeKnowledge.map((record) => ({
    ...record,
    ...required(messages.errorCodes[record.id], record.id),
  }));
  const sources: SourceReference[] = sourceKnowledge.map((record) => ({
    ...record,
    ...required(messages.sources[record.id], record.id),
  }));
  const guides: TroubleshootingGuide[] = guideKnowledge.map((record) => {
    const translation = required(messages.guides[record.id], record.id);
    return {
      ...record,
      slug: translation.slug,
      title: translation.title,
      steps: record.steps.map((stepRecord) => ({
        ...stepRecord,
        ...required(translation.steps[stepRecord.id], `${record.id}/${stepRecord.id}`),
      })),
    };
  });
  const troubleshooterNodes: TroubleshooterNode[] = troubleshooterKnowledge.map((record) => {
    const translation = required(messages.troubleshooter[record.id], record.id);
    if (record.kind === "question") {
      const nextNodeIds = required(record.nextNodeIds, `${record.id}.nextNodeIds`);
      const labels = required(translation.optionLabels, `${record.id}.optionLabels`);
      if (nextNodeIds.length !== labels.length) throw new Error(`Troubleshooter option mismatch: ${record.id}`);
      return {
        id: record.id,
        kind: "question",
        safetyLevel: record.safetyLevel,
        eyebrow: translation.eyebrow,
        title: translation.title,
        body: translation.body,
        options: nextNodeIds.map((nextNodeId, index) => ({ nextNodeId, label: labels[index] })),
      };
    }
    return {
      id: record.id,
      kind: "outcome",
      safetyLevel: record.safetyLevel,
      eyebrow: translation.eyebrow,
      title: translation.title,
      body: translation.body,
    };
  });

  const getCategoryBySlug = (slug: string) => deviceCategories.find((record) => record.slug === slug);
  const getCategoryById = (id: string) => deviceCategories.find((record) => record.id === id);
  const getManufacturerBySlug = (slug: string) => manufacturers.find((record) => record.slug === slug);
  const getManufacturerById = (id: string) => manufacturers.find((record) => record.id === id);
  const getModelBySlug = (manufacturerId: string, slug: string) =>
    models.find((record) => record.manufacturerId === manufacturerId && record.slug === slug);
  const getProblemBySlug = (slug: string) => problems.find((record) => record.slug === slug);
  const getProblemById = (id: string) => problems.find((record) => record.id === id);
  const getErrorCodeBySlug = (manufacturerId: string, slug: string) =>
    errorCodes.find((record) => record.manufacturerId === manufacturerId && record.slug === slug);
  const getGuideById = (id?: string) => guides.find((record) => record.id === id);
  const getSourcesByIds = (ids: string[]) => sources.filter((record) => ids.includes(record.id));
  const getRelatedProblems = (problem: Problem) =>
    problems.filter((record) => problem.relatedProblemIds.includes(record.id));

  const hasVerifiedSources = (ids: string[]) =>
    ids.length > 0 && ids.every((id) => {
      const source = sources.find((record) => record.id === id);
      return source?.verificationStatus === "verified" && source.type !== "editorial-placeholder";
    });
  const isGuideIndexable = (guide: TroubleshootingGuide) =>
    guide.verificationStatus === "verified" && hasVerifiedSources(guide.sourceIds) &&
    guide.steps.every((record) => hasVerifiedSources(record.sourceIds));
  const isModelFamilyIndexable = (family: ModelFamily) =>
    family.verificationStatus === "verified" && hasVerifiedSources(family.sourceIds);
  const isModelIndexable = (model: DeviceModel) => {
    const family = modelFamilies.find((record) => record.id === model.familyId);
    const linkedGuides = model.guideIds.map((id) => getGuideById(id));
    return model.verificationStatus === "verified" && !model.isFictional &&
      hasVerifiedSources(model.sourceIds) && Boolean(family && isModelFamilyIndexable(family)) &&
      linkedGuides.every((guide) => Boolean(guide && isGuideIndexable(guide)));
  };
  const isProblemIndexable = (problem: Problem) => {
    const guide = getGuideById(problem.guideId);
    return problem.verificationStatus === "verified" && hasVerifiedSources(problem.sourceIds) &&
      Boolean(guide && isGuideIndexable(guide));
  };
  const isErrorCodeIndexable = (errorCode: ErrorCode) => {
    const linkedFamilies = errorCode.modelFamilyIds.map((id) => modelFamilies.find((record) => record.id === id));
    const guide = getGuideById(errorCode.guideId);
    return errorCode.verificationStatus === "verified" && !errorCode.isFictional &&
      hasVerifiedSources(errorCode.sourceIds) &&
      linkedFamilies.every((family) => Boolean(family && isModelFamilyIndexable(family))) &&
      (!errorCode.guideId || Boolean(guide && isGuideIndexable(guide)));
  };
  const manufacturerHasIndexableContent = (manufacturerId: string) =>
    models.some((model) => model.manufacturerId === manufacturerId && isModelIndexable(model)) ||
    errorCodes.some((record) => record.manufacturerId === manufacturerId && isErrorCodeIndexable(record));

  const category = required(deviceCategories[0], "first category");
  const searchItems: SearchItem[] = [
    {
      id: "search-dishwashers",
      label: category.name,
      description: category.description,
      type: "device",
      href: paths.category(locale, category),
      keywords: [category.name, category.singularName, messages.ui.searchKeywordAppliance, messages.ui.searchKeywordDevice],
    },
    ...manufacturers.map((manufacturer) => ({
      id: `search-${manufacturer.id}`,
      label: formatMessage(messages.ui.searchManufacturerLabel, {
        name: manufacturer.name,
        category: category.name.toLocaleLowerCase(locale),
      }),
      description: manufacturer.overview,
      type: "manufacturer" as const,
      href: paths.manufacturer(locale, category, manufacturer),
      keywords: [manufacturer.name, category.name, category.singularName, messages.ui.searchKeywordBrand],
    })),
    ...models.map((model) => {
      const manufacturer = required(getManufacturerById(model.manufacturerId), model.manufacturerId);
      return {
        id: `search-${model.id}`,
        label: model.name,
        description: model.modelNumber,
        type: "model" as const,
        href: paths.model(locale, category, manufacturer, model),
        keywords: [model.modelNumber, model.name, category.singularName, messages.ui.searchKeywordModel],
        isDemo: model.verificationStatus !== "verified" || model.isFictional,
      };
    }),
    ...problems.map((problem) => ({
      id: `search-${problem.id}`,
      label: problem.title,
      description: problem.summary,
      type: "problem" as const,
      href: paths.problem(locale, category, problem),
      keywords: [...problem.symptomLabels, category.singularName, messages.ui.searchKeywordProblem],
      isDemo: problem.verificationStatus !== "verified",
    })),
    ...errorCodes.map((errorCode) => {
      const manufacturer = required(getManufacturerById(errorCode.manufacturerId), errorCode.manufacturerId);
      return {
        id: `search-${errorCode.id}`,
        label: `${manufacturer.name} ${errorCode.code}`,
        description: errorCode.title,
        type: "errorCode" as const,
        href: paths.errorCode(locale, category, manufacturer, errorCode),
        keywords: [errorCode.code, ...errorCode.aliases, ...errorCode.signalLabels, manufacturer.name, category.singularName, messages.ui.searchKeywordErrorCode],
        isDemo: errorCode.verificationStatus !== "verified" || errorCode.isFictional,
      };
    }),
  ];

  return {
    locale, messages, deviceCategories, manufacturers, modelFamilies, models, problems,
    errorCodes, guides, sources, troubleshooterNodes, searchItems,
    getCategoryBySlug, getCategoryById, getManufacturerBySlug, getManufacturerById,
    getModelBySlug, getProblemBySlug, getProblemById, getErrorCodeBySlug, getGuideById,
    getSourcesByIds, getRelatedProblems, isGuideIndexable, isModelFamilyIndexable,
    isModelIndexable, isProblemIndexable, isErrorCodeIndexable, manufacturerHasIndexableContent,
  };
}

type Content = ReturnType<typeof getContent>;
const contentCache = new Map<Locale, Content>();

export function getCachedContent(locale: Locale): Content {
  const cached = contentCache.get(locale);
  if (cached) return cached;
  const content = getContent(locale);
  validateContent(content);
  contentCache.set(locale, content);
  return content;
}

function validateContent(content: Content) {
  const errors: string[] = [];
  const unique = <T>(label: string, records: T[], key: (record: T) => string) => {
    const seen = new Set<string>();
    for (const record of records) {
      const value = key(record);
      if (seen.has(value)) errors.push(`${label} has duplicate ${value}`);
      seen.add(value);
    }
  };
  const ids = <T extends { id: string }>(records: T[]) => new Set(records.map((record) => record.id));
  const sourceIds = ids(content.sources);
  const guideIds = ids(content.guides);
  const problemIds = ids(content.problems);
  const errorIds = ids(content.errorCodes);
  const manufacturerIds = ids(content.manufacturers);
  const categoryIds = ids(content.deviceCategories);
  const familyIds = ids(content.modelFamilies);
  const modelIds = ids(content.models);
  const requireIds = (owner: string, values: string[], available: Set<string>) => {
    values.forEach((value) => { if (!available.has(value)) errors.push(`${owner} references missing ${value}`); });
  };

  unique("category IDs", content.deviceCategories, (record) => record.id);
  unique("category slugs", content.deviceCategories, (record) => record.slug);
  unique("manufacturer IDs", content.manufacturers, (record) => record.id);
  unique("manufacturer slugs", content.manufacturers, (record) => record.slug);
  unique("problem IDs", content.problems, (record) => record.id);
  unique("problem slugs", content.problems, (record) => record.slug);
  unique("guide IDs", content.guides, (record) => record.id);
  unique("guide slugs", content.guides, (record) => record.slug);
  unique("model family IDs", content.modelFamilies, (record) => record.id);
  unique("model family routes", content.modelFamilies, (record) => `${record.manufacturerId}:${record.slug}`);
  unique("model IDs", content.models, (record) => record.id);
  unique("model routes", content.models, (record) => `${record.manufacturerId}:${record.slug}`);
  unique("model identifiers", content.models, (record) => `${record.manufacturerId}:${record.modelNumber.toLocaleLowerCase(content.locale)}`);
  unique("error IDs", content.errorCodes, (record) => record.id);
  unique("error routes", content.errorCodes, (record) => `${record.manufacturerId}:${record.slug}`);
  unique("error identifiers", content.errorCodes, (record) => `${record.manufacturerId}:${record.code.toLocaleLowerCase(content.locale)}`);
  unique(
    "error code and alias identifiers",
    content.errorCodes.flatMap((record) =>
      [record.code, ...record.aliases].map((identifier) => ({
        manufacturerId: record.manufacturerId,
        identifier,
      })),
    ),
    (record) => `${record.manufacturerId}:${record.identifier.toLocaleLowerCase(content.locale).trim()}`,
  );
  unique(
    "error aliases",
    content.errorCodes.flatMap((record) =>
      record.aliases.map((alias) => ({ manufacturerId: record.manufacturerId, alias })),
    ),
    (record) => `${record.manufacturerId}:${record.alias.toLocaleLowerCase(content.locale).trim()}`,
  );
  unique("source IDs", content.sources, (record) => record.id);
  unique("source URLs", content.sources, (record) => record.url ?? record.id);
  unique("search IDs", content.searchItems, (record) => record.id);
  unique("troubleshooter node IDs", content.troubleshooterNodes, (record) => record.id);

  if (content.deviceCategories.some((record) => record.slug === content.messages.routes.devices)) {
    errors.push("a category slug conflicts with the localized devices route");
  }
  const reservedManufacturerSlugs = new Set([
    content.messages.routes.problems,
    content.messages.routes.troubleshooter,
  ]);
  content.manufacturers.forEach((record) => {
    if (reservedManufacturerSlugs.has(record.slug)) errors.push(`${record.id} uses a reserved route slug`);
  });
  content.errorCodes.forEach((record) => {
    if (record.slug === content.messages.routes.models) errors.push(`${record.id} conflicts with the localized models route`);
  });

  content.deviceCategories.forEach((record) => {
    requireIds(record.id, record.manufacturerIds, manufacturerIds);
    record.manufacturerIds.forEach((manufacturerId) => {
      const manufacturer = content.getManufacturerById(manufacturerId);
      if (manufacturer && !manufacturer.categoryIds.includes(record.id)) {
        errors.push(`${manufacturer.id} is missing reciprocal category ${record.id}`);
      }
    });
  });
  content.manufacturers.forEach((record) => {
    requireIds(record.id, record.categoryIds, categoryIds);
    record.categoryIds.forEach((categoryId) => {
      const category = content.getCategoryById(categoryId);
      if (category && !category.manufacturerIds.includes(record.id)) {
        errors.push(`${category.id} is missing reciprocal manufacturer ${record.id}`);
      }
    });
  });
  content.modelFamilies.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    requireIds(record.id, record.modelIds, modelIds);
    requireIds(record.id, record.sourceIds, sourceIds);
    record.modelIds.forEach((modelId) => {
      const model = content.models.find((candidate) => candidate.id === modelId);
      if (model && (model.familyId !== record.id || model.categoryId !== record.categoryId || model.manufacturerId !== record.manufacturerId)) {
        errors.push(`${record.id} conflicts with ${model.id}`);
      }
    });
    if (record.verificationStatus === "verified" && !content.isModelFamilyIndexable(record)) {
      errors.push(`${record.id} is verified but not indexable`);
    }
  });
  content.models.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    requireIds(record.id, [record.familyId], familyIds);
    requireIds(record.id, record.guideIds, guideIds);
    requireIds(record.id, record.sourceIds, sourceIds);
    const family = content.modelFamilies.find((candidate) => candidate.id === record.familyId);
    if (family && !family.modelIds.includes(record.id)) errors.push(`${record.id} is missing from ${family.id}`);
    if (record.verificationStatus === "verified" && !content.isModelIndexable(record)) {
      errors.push(`${record.id} is verified but not indexable`);
    }
  });
  content.problems.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, record.relatedProblemIds, problemIds);
    requireIds(record.id, record.sourceIds, sourceIds);
    if (record.guideId) requireIds(record.id, [record.guideId], guideIds);
    if (record.relatedProblemIds.includes(record.id)) errors.push(`${record.id} relates to itself`);
    record.relatedProblemIds.forEach((relatedId) => {
      const related = content.getProblemById(relatedId);
      if (related && !related.relatedProblemIds.includes(record.id)) {
        errors.push(`${record.id} and ${related.id} are not reciprocally related`);
      }
    });
    if (record.guideId) {
      const guide = content.getGuideById(record.guideId);
      if (guide && !guide.problemIds.includes(record.id)) errors.push(`${record.id} is missing from ${guide.id}`);
    }
    if (record.verificationStatus === "verified" && !content.isProblemIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.errorCodes.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    requireIds(record.id, record.modelFamilyIds, familyIds);
    requireIds(record.id, record.sourceIds, sourceIds);
    if (record.guideId) requireIds(record.id, [record.guideId], guideIds);
    if (record.guideId) {
      const guide = content.getGuideById(record.guideId);
      if (guide && !guide.errorCodeIds.includes(record.id)) errors.push(`${record.id} is missing from ${guide.id}`);
    }
    if (!record.sourceScope.trim() || !record.applicabilityNote.trim()) errors.push(`${record.id} lacks localized scope`);
    if (record.signalIds.length !== record.signalLabels.length) errors.push(`${record.id} has mismatched localized signals`);
    unique(`${record.id} signal IDs`, record.signalIds, (signalId) => signalId);
    if (record.verificationStatus === "verified" && !content.isErrorCodeIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.guides.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, record.problemIds, problemIds);
    requireIds(record.id, [record.canonicalProblemId], problemIds);
    requireIds(record.id, record.errorCodeIds, errorIds);
    requireIds(record.id, record.sourceIds, sourceIds);
    if (!record.problemIds.includes(record.canonicalProblemId)) {
      errors.push(`${record.id} does not include its canonical problem`);
    }
    record.problemIds.forEach((problemId) => {
      const problem = content.getProblemById(problemId);
      if (problem && problem.guideId !== record.id) errors.push(`${record.id} is not assigned by ${problem.id}`);
    });
    record.errorCodeIds.forEach((errorId) => {
      const errorCode = content.errorCodes.find((candidate) => candidate.id === errorId);
      if (errorCode && errorCode.guideId !== record.id) errors.push(`${record.id} is not assigned by ${errorCode.id}`);
    });
    unique(`${record.id} step IDs`, record.steps, (step) => step.id);
    record.steps.forEach((step) => {
      requireIds(`${record.id}/${step.id}`, step.sourceIds, sourceIds);
      step.sourceIds.forEach((sourceId) => {
        if (!record.sourceIds.includes(sourceId)) errors.push(`${record.id}/${step.id} uses undeclared ${sourceId}`);
      });
    });
    if (record.verificationStatus === "verified" && !content.isGuideIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
    if (record.verificationStatus === "verified" && !record.lastReviewed) errors.push(`${record.id} has no review date`);
  });
  content.sources.forEach((record) => {
    if (record.verificationStatus === "verified" && record.type === "editorial-placeholder") {
      errors.push(`${record.id} cannot verify a placeholder`);
    }
    if (record.verificationStatus === "verified" && (!record.url || !record.url.startsWith("https://"))) {
      errors.push(`${record.id} is verified without an HTTPS URL`);
    }
  });
  const referencedSourceIds = new Set([
    ...content.modelFamilies.flatMap((record) => record.sourceIds),
    ...content.models.flatMap((record) => record.sourceIds),
    ...content.problems.flatMap((record) => record.sourceIds),
    ...content.errorCodes.flatMap((record) => record.sourceIds),
    ...content.guides.flatMap((record) => [
      ...record.sourceIds,
      ...record.steps.flatMap((step) => step.sourceIds),
    ]),
  ]);
  content.sources.forEach((record) => {
    if (!referencedSourceIds.has(record.id)) errors.push(`${record.id} is not cited by any record`);
  });
  const nodeIds = ids(content.troubleshooterNodes);
  if (!nodeIds.has("start")) errors.push("troubleshooter has no start node");
  content.troubleshooterNodes.forEach((record) => {
    if (record.kind === "question") {
      if (!record.options.length) errors.push(`${record.id} has no options`);
      requireIds(record.id, record.options.map((option) => option.nextNodeId), nodeIds);
    }
  });
  content.searchItems.forEach((record) => {
    if (!record.href.startsWith(`/${content.locale}/`)) errors.push(`${record.id} leaves active locale`);
  });
  if (errors.length) throw new Error(`Invalid FixLookup content (${content.locale}):\n${errors.join("\n")}`);
}
