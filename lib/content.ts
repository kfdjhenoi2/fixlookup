import {
  applicabilityScopeKnowledge,
  categoryKnowledge,
  errorInterpretationKnowledge,
  errorSignalKnowledge,
  evidenceClaimKnowledge,
  guideKnowledge,
  manufacturerKnowledge,
  marketKnowledge,
  modelFamilyKnowledge,
  modelKnowledge,
  problemKnowledge,
  sourceKnowledge,
  troubleshooterKnowledge,
} from "./data/dishwashers";
import { getLocaleContent } from "./i18n";
import type { Locale } from "./i18n/config";
import { formatMessage } from "./i18n/messages";
import { paths } from "./i18n/routing";
import { findOverlappingInterpretations, modelIsExplicitlyInScope } from "./knowledge-validation.mjs";
import { isVerifiedForPublication } from "./publication.mjs";
import { isIsoDate } from "./review";
import { siteConfig } from "./site";
import type {
  ApplicabilityScope,
  DeviceCategory,
  DeviceModel,
  ErrorCode,
  ErrorInterpretation,
  EvidenceClaim,
  Manufacturer,
  Market,
  ModelFamily,
  Problem,
  SafetyLevel,
  SearchItem,
  SourceReference,
  TroubleshooterNode,
  TroubleshootingGuide,
} from "./types";

function required<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Missing localization or record: ${label}`);
  return value;
}

const uniqueStrings = (values: string[]) => [...new Set(values)];
const safetyOrder: Record<SafetyLevel, number> = { "user-safe": 0, caution: 1, "professional-only": 2 };
const highestSafety = (levels: SafetyLevel[]): SafetyLevel =>
  levels.reduce((highest, level) => safetyOrder[level] > safetyOrder[highest] ? level : highest, "user-safe");

export function getContent(locale: Locale) {
  const messages = getLocaleContent(locale);
  const manufacturers: Manufacturer[] = manufacturerKnowledge.map((record) => ({
    ...record,
    ...required(messages.manufacturers[record.id], record.id),
  }));
  const deviceCategories: DeviceCategory[] = categoryKnowledge.map((record) => ({
    ...record,
    ...required(messages.categories[record.id], record.id),
    manufacturerIds: manufacturers.filter((manufacturer) => manufacturer.categoryIds.includes(record.id)).map((manufacturer) => manufacturer.id),
  }));
  const markets: Market[] = marketKnowledge;
  const sources: SourceReference[] = sourceKnowledge.map((record) => ({
    ...record,
    ...required(messages.sources[record.id], record.id),
  }));
  const applicabilityScopes: ApplicabilityScope[] = applicabilityScopeKnowledge.map((record) => ({
    ...record,
    ...required(messages.applicabilityScopes[record.id], record.id),
  }));
  const evidenceClaims: EvidenceClaim[] = evidenceClaimKnowledge;
  const sourceIdsForClaims = (claimIds: string[]) => uniqueStrings(claimIds.flatMap((claimId) =>
    required(evidenceClaims.find((claim) => claim.id === claimId), claimId).sourceIds,
  ));

  const guides: TroubleshootingGuide[] = guideKnowledge.map((record) => {
    const translation = required(messages.guides[record.id], record.id);
    const steps = record.steps.map((stepRecord) => ({
      ...stepRecord,
      ...required(translation.steps[stepRecord.id], `${record.id}/${stepRecord.id}`),
      sourceIds: sourceIdsForClaims(stepRecord.evidenceClaimIds),
    }));
    return {
      ...record,
      slug: translation.slug,
      title: translation.title,
      steps,
      sourceIds: uniqueStrings(steps.flatMap((step) => step.sourceIds)),
    };
  });
  const problems: Problem[] = problemKnowledge.map((record) => {
    const guide = guides.find((candidate) => candidate.problemIds.includes(record.id));
    return {
      ...record,
      ...required(messages.problems[record.id], record.id),
      guideId: guide?.id,
      sourceIds: guide?.sourceIds ?? [],
    };
  });
  const modelFamilies: ModelFamily[] = modelFamilyKnowledge.map((record) => ({
    ...record,
    ...required(messages.modelFamilies[record.id], record.id),
    sourceIds: sourceIdsForClaims(record.evidenceClaimIds),
  }));
  const models: DeviceModel[] = modelKnowledge.map((record) => {
    const scopes = applicabilityScopes.filter((scope) => modelIsExplicitlyInScope(record, scope));
    const guideIds = uniqueStrings(errorInterpretationKnowledge
      .filter((interpretation) => scopes.some((scope) => scope.id === interpretation.applicabilityScopeId))
      .flatMap((interpretation) => interpretation.guideIds));
    return {
      ...record,
      ...required(messages.models[record.id], record.id),
      guideIds,
      sourceIds: sourceIdsForClaims(record.evidenceClaimIds),
    };
  });
  const interpretations: ErrorInterpretation[] = errorInterpretationKnowledge.map((record) => ({
    ...record,
    ...required(messages.errorInterpretations[record.id], record.id),
    applicability: required(applicabilityScopes.find((scope) => scope.id === record.applicabilityScopeId), record.applicabilityScopeId),
    sourceIds: sourceIdsForClaims(record.evidenceClaimIds),
  }));
  const errorCodes: ErrorCode[] = errorSignalKnowledge.map((record) => {
    const linkedInterpretations = interpretations.filter((interpretation) => interpretation.signalId === record.id);
    const first = required(linkedInterpretations[0], `${record.id} interpretation`);
    return {
      ...record,
      ...required(messages.errorSignals[record.id], record.id),
      interpretations: linkedInterpretations,
      sourceIds: uniqueStrings([
        ...sourceIdsForClaims(record.evidenceClaimIds),
        ...linkedInterpretations.flatMap((interpretation) => interpretation.sourceIds),
      ]),
      problemIds: uniqueStrings(linkedInterpretations.flatMap((interpretation) => interpretation.problemIds)),
      guideIds: uniqueStrings(linkedInterpretations.flatMap((interpretation) => interpretation.guideIds)),
      guideId: linkedInterpretations.flatMap((interpretation) => interpretation.guideIds)[0],
      safetyLevel: highestSafety(linkedInterpretations.map((interpretation) => interpretation.safetyLevel)),
      summary: first.summary,
      sourceScope: first.applicability.sourceScope,
      applicabilityNote: first.applicability.applicabilityNote,
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
  const getModelBySlug = (manufacturerId: string, slug: string) => models.find((record) => record.manufacturerId === manufacturerId && record.slug === slug);
  const getProblemBySlug = (slug: string) => problems.find((record) => record.slug === slug);
  const getProblemById = (id: string) => problems.find((record) => record.id === id);
  const getErrorCodeBySlug = (manufacturerId: string, slug: string) => errorCodes.find((record) => record.manufacturerId === manufacturerId && record.slug === slug);
  const getGuideById = (id?: string) => guides.find((record) => record.id === id);
  const getSourcesByIds = (ids: string[]) => sources.filter((record) => ids.includes(record.id));
  const hasReviewSchedule = (record: { lastReviewed: string | null; reviewIntervalDays: number | null }) =>
    isIsoDate(record.lastReviewed) && Number.isInteger(record.reviewIntervalDays) && (record.reviewIntervalDays ?? 0) > 0;
  const isSourceIndexable = (source: SourceReference) =>
    isVerifiedForPublication(source) && source.kind !== "editorial-placeholder" && Boolean(source.url?.startsWith("https://")) && hasReviewSchedule(source);
  const hasVerifiedSources = (ids: string[]) => ids.length > 0 && ids.every((id) => {
    const source = sources.find((record) => record.id === id);
    return Boolean(source && isSourceIndexable(source));
  });
  const hasVerifiedClaims = (ids: string[]) => ids.length > 0 && ids.every((id) => {
    const claim = evidenceClaims.find((record) => record.id === id);
    return Boolean(claim && isVerifiedForPublication(claim) && hasVerifiedSources(claim.sourceIds));
  });
  const isGuideIndexable = (guide: TroubleshootingGuide) => {
    const category = getCategoryById(guide.categoryId);
    return isVerifiedForPublication(guide) && Boolean(category && isVerifiedForPublication(category)) && hasReviewSchedule(guide) &&
      guide.steps.length > 0 && guide.steps.every((step) => hasVerifiedClaims(step.evidenceClaimIds));
  };
  const isModelFamilyIndexable = (family: ModelFamily) => {
    const category = getCategoryById(family.categoryId);
    const manufacturer = getManufacturerById(family.manufacturerId);
    return isVerifiedForPublication(family) && Boolean(category && isVerifiedForPublication(category)) &&
      Boolean(manufacturer && isVerifiedForPublication(manufacturer)) && hasVerifiedClaims(family.evidenceClaimIds);
  };
  const isModelIndexable = (model: DeviceModel) => {
    const category = getCategoryById(model.categoryId);
    const manufacturer = getManufacturerById(model.manufacturerId);
    const family = model.familyId ? modelFamilies.find((record) => record.id === model.familyId) : undefined;
    return isVerifiedForPublication(model) && Boolean(category && isVerifiedForPublication(category)) &&
      Boolean(manufacturer && isVerifiedForPublication(manufacturer)) && hasVerifiedClaims(model.evidenceClaimIds) &&
      (!model.familyId || Boolean(family && isModelFamilyIndexable(family))) &&
      model.guideIds.every((id) => Boolean(getGuideById(id) && isGuideIndexable(required(getGuideById(id), id))));
  };
  const isProblemIndexable = (problem: Problem) => {
    const category = getCategoryById(problem.categoryId);
    const guide = getGuideById(problem.guideId);
    return isVerifiedForPublication(problem) && Boolean(category && isVerifiedForPublication(category)) &&
      Boolean(guide && isGuideIndexable(guide));
  };
  const isInterpretationIndexable = (interpretation: ErrorInterpretation) =>
    isVerifiedForPublication(interpretation) && isVerifiedForPublication(interpretation.applicability) &&
    (!["manufacturer-market", "feature"].includes(interpretation.applicability.kind) || interpretation.applicability.exactModelConfirmationRequired) &&
    hasVerifiedClaims(interpretation.evidenceClaimIds) &&
    interpretation.problemIds.length > 0 && interpretation.problemIds.every((id) => {
      const problem = getProblemById(id);
      return Boolean(problem && isProblemIndexable(problem));
    }) && interpretation.guideIds.length > 0 && interpretation.guideIds.every((id) => {
      const guide = getGuideById(id);
      return Boolean(guide && isGuideIndexable(guide));
    });
  const isErrorCodeIndexable = (errorCode: ErrorCode) => {
    const category = getCategoryById(errorCode.categoryId);
    const manufacturer = getManufacturerById(errorCode.manufacturerId);
    return isVerifiedForPublication(errorCode) && Boolean(category && isVerifiedForPublication(category)) &&
      Boolean(manufacturer && isVerifiedForPublication(manufacturer)) && hasVerifiedClaims(errorCode.evidenceClaimIds) &&
      errorCode.interpretations.length > 0 && errorCode.interpretations.every(isInterpretationIndexable);
  };
  const getRelatedProblems = (problem: Problem) => problems.filter((record) => problem.relatedProblemIds.includes(record.id) && isProblemIndexable(record));
  const manufacturerHasIndexableContent = (manufacturerId: string, categoryId?: string) => {
    const manufacturer = getManufacturerById(manufacturerId);
    return Boolean(manufacturer && isVerifiedForPublication(manufacturer) && (
      models.some((model) => model.manufacturerId === manufacturerId && (!categoryId || model.categoryId === categoryId) && isModelIndexable(model)) ||
      errorCodes.some((record) => record.manufacturerId === manufacturerId && (!categoryId || record.categoryId === categoryId) && isErrorCodeIndexable(record))
    ));
  };
  const categoryHasIndexableContent = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return Boolean(category && isVerifiedForPublication(category) && (
      problems.some((problem) => problem.categoryId === categoryId && isProblemIndexable(problem)) ||
      manufacturers.some((manufacturer) => manufacturer.categoryIds.includes(categoryId) && manufacturerHasIndexableContent(manufacturer.id, categoryId))
    ));
  };

  const searchItems: SearchItem[] = [
    ...deviceCategories.filter((category) => categoryHasIndexableContent(category.id)).map((category) => ({
      id: `search-${category.id}`, label: category.name, description: category.description, type: "device" as const,
      href: paths.category(locale, category), identifiers: [], aliases: [], titleTerms: [category.name, category.singularName],
      descriptionTerms: [messages.ui.searchKeywordAppliance, messages.ui.searchKeywordDevice], applicabilityIdentifiers: [],
    })),
    ...manufacturers.flatMap((manufacturer) => manufacturer.categoryIds.flatMap((categoryId) => {
      const category = getCategoryById(categoryId);
      if (!category || !manufacturerHasIndexableContent(manufacturer.id, category.id)) return [];
      return [{
        id: `search-${category.id}-${manufacturer.id}`,
        label: formatMessage(messages.ui.searchManufacturerLabel, { name: manufacturer.name, category: category.name.toLocaleLowerCase(locale) }),
        description: manufacturer.overview, type: "manufacturer" as const, href: paths.manufacturer(locale, category, manufacturer),
        identifiers: [], aliases: [], manufacturer: manufacturer.name, titleTerms: [manufacturer.name, category.name, category.singularName],
        descriptionTerms: [messages.ui.searchKeywordBrand], applicabilityIdentifiers: [],
      }];
    })),
    ...models.filter(isModelIndexable).flatMap((model) => {
      const category = getCategoryById(model.categoryId);
      const manufacturer = required(getManufacturerById(model.manufacturerId), model.manufacturerId);
      return category ? [{
        id: `search-${model.id}`, label: model.name, description: model.modelNumber, type: "model" as const,
        href: paths.model(locale, category, manufacturer, model), identifiers: [model.modelNumber], aliases: [], manufacturer: manufacturer.name,
        titleTerms: [model.name, category.singularName], descriptionTerms: [messages.ui.searchKeywordModel], applicabilityIdentifiers: [],
      }] : [];
    }),
    ...problems.filter(isProblemIndexable).flatMap((problem) => {
      const category = getCategoryById(problem.categoryId);
      return category ? [{
        id: `search-${problem.id}`, label: problem.title, description: problem.summary, type: "problem" as const,
        href: paths.problem(locale, category, problem), identifiers: [], aliases: problem.symptomLabels,
        titleTerms: [problem.title, ...problem.symptomLabels, category.singularName], descriptionTerms: [problem.summary, messages.ui.searchKeywordProblem],
        applicabilityIdentifiers: [],
      }] : [];
    }),
    ...errorCodes.filter(isErrorCodeIndexable).flatMap((errorCode) => {
      const category = getCategoryById(errorCode.categoryId);
      const manufacturer = required(getManufacturerById(errorCode.manufacturerId), errorCode.manufacturerId);
      const relevantScopes = errorCode.interpretations.map((interpretation) => interpretation.applicability);
      const applicabilityIdentifiers = uniqueStrings(relevantScopes.flatMap((scope) => [
        ...scope.modelIds.flatMap((id) => models.filter((model) => model.id === id).map((model) => model.modelNumber)),
        ...scope.modelFamilyIds.flatMap((id) => modelFamilies.filter((family) => family.id === id).map((family) => family.name)),
      ]));
      return category ? [{
        id: `search-${errorCode.id}`, label: `${manufacturer.name} ${errorCode.code}`, description: errorCode.title,
        type: "errorCode" as const, href: paths.errorCode(locale, category, manufacturer, errorCode),
        identifiers: [errorCode.code], aliases: [...errorCode.aliases, ...errorCode.signalLabels], manufacturer: manufacturer.name,
        titleTerms: [errorCode.title, category.singularName], descriptionTerms: [errorCode.summary, messages.ui.searchKeywordErrorCode],
        applicabilityIdentifiers,
      }] : [];
    }),
  ];

  return {
    locale, messages, deviceCategories, manufacturers, markets, modelFamilies, models, problems, errorCodes, interpretations,
    applicabilityScopes, evidenceClaims, guides, sources, troubleshooterNodes, searchItems,
    getCategoryBySlug, getCategoryById, getManufacturerBySlug, getManufacturerById, getModelBySlug,
    getProblemBySlug, getProblemById, getErrorCodeBySlug, getGuideById, getSourcesByIds, getRelatedProblems,
    isGuideIndexable, isModelFamilyIndexable, isModelIndexable, isProblemIndexable, isErrorCodeIndexable,
    manufacturerHasIndexableContent, categoryHasIndexableContent,
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
  const ids = <T extends { id: string }>(records: T[]) => new Set(records.map((record) => record.id));
  const unique = <T>(label: string, records: T[], key: (record: T) => string) => {
    const seen = new Set<string>();
    records.forEach((record) => {
      const value = key(record);
      if (seen.has(value)) errors.push(`${label} has duplicate ${value}`);
      seen.add(value);
    });
  };
  const requireIds = (owner: string, values: string[], available: Set<string>) => values.forEach((value) => {
    if (!available.has(value)) errors.push(`${owner} references missing ${value}`);
  });
  const categoryIds = ids(content.deviceCategories);
  const manufacturerIds = ids(content.manufacturers);
  const marketIds = ids(content.markets);
  const familyIds = ids(content.modelFamilies);
  const modelIds = ids(content.models);
  const problemIds = ids(content.problems);
  const guideIds = ids(content.guides);
  const signalIds = ids(content.errorCodes);
  const scopeIds = ids(content.applicabilityScopes);
  const claimIds = ids(content.evidenceClaims);
  const sourceIds = ids(content.sources);

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
  unique("interpretation IDs", content.interpretations, (record) => record.id);
  unique("scope IDs", content.applicabilityScopes, (record) => record.id);
  unique("claim IDs", content.evidenceClaims, (record) => record.id);
  unique("source IDs", content.sources, (record) => record.id);
  unique("source URLs", content.sources, (record) => record.url ?? record.id);
  unique("search IDs", content.searchItems, (record) => record.id);
  unique("troubleshooter node IDs", content.troubleshooterNodes, (record) => record.id);

  const identifierOwners = new Map<string, string>();
  content.errorCodes.forEach((record) => [record.code, ...record.aliases].forEach((identifier) => {
    const key = `${record.manufacturerId}:${identifier.toLocaleLowerCase(content.locale).replace(/[^a-z0-9]/g, "")}`;
    const owner = identifierOwners.get(key);
    if (owner && owner !== record.id) errors.push(`error identifier ${identifier} is shared by ${owner} and ${record.id}`);
    identifierOwners.set(key, record.id);
  }));
  content.errorCodes.forEach((record) => record.signalIds.forEach((signalId) => {
    const key = `${record.manufacturerId}:display:${signalId}`;
    const owner = identifierOwners.get(key);
    if (owner && owner !== record.id) errors.push(`display signal ${signalId} is shared by ${owner} and ${record.id}`);
    identifierOwners.set(key, record.id);
  }));

  if (!categoryIds.has(siteConfig.primaryCategoryId)) errors.push(`missing primary category ${siteConfig.primaryCategoryId}`);
  const reservedCategorySlugs = new Set([
    content.messages.routes.devices,
    content.messages.routes.about,
    content.messages.routes.editorial,
    content.messages.routes.safety,
    content.messages.routes.privacy,
    content.messages.routes.contact,
  ]);
  content.deviceCategories.forEach((record) => {
    if (reservedCategorySlugs.has(record.slug)) errors.push(`${record.id} uses a reserved top-level route slug`);
  });
  const reservedManufacturerSlugs = new Set([content.messages.routes.problems, content.messages.routes.troubleshooter]);
  content.manufacturers.forEach((record) => {
    if (reservedManufacturerSlugs.has(record.slug)) errors.push(`${record.id} uses a reserved manufacturer route slug`);
  });
  content.errorCodes.forEach((record) => {
    if (record.slug === content.messages.routes.models) errors.push(`${record.id} conflicts with the models route`);
  });
  content.manufacturers.forEach((record) => requireIds(record.id, record.categoryIds, categoryIds));
  content.modelFamilies.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    requireIds(record.id, record.evidenceClaimIds, claimIds);
    if (record.verificationStatus === "verified" && !content.isModelFamilyIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.models.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    if (record.familyId) requireIds(record.id, [record.familyId], familyIds);
    requireIds(record.id, record.evidenceClaimIds, claimIds);
    requireIds(record.id, record.guideIds, guideIds);
    const family = record.familyId ? content.modelFamilies.find((candidate) => candidate.id === record.familyId) : undefined;
    if (family && (family.categoryId !== record.categoryId || family.manufacturerId !== record.manufacturerId)) {
      errors.push(`${record.id} has unsupported membership in ${family.id}`);
    }
    if (record.verificationStatus === "verified" && !content.isModelIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.problems.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, record.relatedProblemIds, problemIds);
    if (record.relatedProblemIds.includes(record.id)) errors.push(`${record.id} relates to itself`);
    record.relatedProblemIds.forEach((relatedId) => {
      const related = content.getProblemById(relatedId);
      if (related && !related.relatedProblemIds.includes(record.id)) errors.push(`${record.id} and ${related.id} are not reciprocal`);
    });
    if (record.guideId) requireIds(record.id, [record.guideId], guideIds);
    const assignedGuides = content.guides.filter((guide) => guide.problemIds.includes(record.id));
    if (assignedGuides.length !== 1) errors.push(`${record.id} must have exactly one shared guide`);
    if (record.verificationStatus === "verified" && !content.isProblemIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.applicabilityScopes.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    requireIds(record.id, record.marketIds, marketIds);
    requireIds(record.id, record.modelFamilyIds, familyIds);
    requireIds(record.id, record.modelIds, modelIds);
    if (!record.sourceScope.trim() || !record.applicabilityNote.trim()) errors.push(`${record.id} lacks localized scope`);
    if (record.kind === "manufacturer-market" && record.marketIds.length === 0) errors.push(`${record.id} has no market boundary`);
    if (record.kind === "model-family" && record.modelFamilyIds.length === 0) errors.push(`${record.id} has no family boundary`);
    if (record.kind === "exact-model" && record.modelIds.length === 0) errors.push(`${record.id} has no model boundary`);
    if (record.kind === "feature" && record.featureTags.length === 0) errors.push(`${record.id} has no feature boundary`);
    record.modelFamilyIds.forEach((familyId) => {
      const family = content.modelFamilies.find((candidate) => candidate.id === familyId);
      if (family && (family.categoryId !== record.categoryId || family.manufacturerId !== record.manufacturerId)) {
        errors.push(`${record.id} has an unsupported family reference ${family.id}`);
      }
    });
    record.modelIds.forEach((modelId) => {
      const model = content.models.find((candidate) => candidate.id === modelId);
      if (model && (model.categoryId !== record.categoryId || model.manufacturerId !== record.manufacturerId)) {
        errors.push(`${record.id} has an unsupported model reference ${model.id}`);
      }
    });
  });
  content.evidenceClaims.forEach((record) => {
    requireIds(record.id, record.sourceIds, sourceIds);
    if (record.applicabilityScopeId) requireIds(record.id, [record.applicabilityScopeId], scopeIds);
    if (record.verificationStatus === "verified" && record.sourceIds.length === 0) errors.push(`${record.id} is verified without evidence`);
  });
  content.errorCodes.forEach((record) => {
    requireIds(record.id, [record.categoryId], categoryIds);
    requireIds(record.id, [record.manufacturerId], manufacturerIds);
    requireIds(record.id, record.evidenceClaimIds, claimIds);
    if (record.signalIds.length !== record.signalLabels.length) errors.push(`${record.id} has mismatched localized signals`);
    unique(`${record.id} signal IDs`, record.signalIds, (signalId) => signalId);
    if (record.verificationStatus === "verified" && !content.isErrorCodeIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.interpretations.forEach((record) => {
    requireIds(record.id, [record.signalId], signalIds);
    requireIds(record.id, [record.applicabilityScopeId], scopeIds);
    requireIds(record.id, record.problemIds, problemIds);
    requireIds(record.id, record.guideIds, guideIds);
    requireIds(record.id, record.evidenceClaimIds, claimIds);
  });
  findOverlappingInterpretations(content.interpretations, content.applicabilityScopes).forEach(([left, right]) => {
    errors.push(`${left} and ${right} have overlapping applicability for one signal`);
  });
  content.guides.forEach((record) => {
    requireIds(record.id, [record.categoryId, record.canonicalProblemId], new Set([...categoryIds, ...problemIds]));
    requireIds(record.id, record.problemIds, problemIds);
    if (!record.problemIds.includes(record.canonicalProblemId)) errors.push(`${record.id} omits its canonical problem`);
    unique(`${record.id} step IDs`, record.steps, (step) => step.id);
    record.steps.forEach((step) => requireIds(`${record.id}/${step.id}`, step.evidenceClaimIds, claimIds));
    if (record.verificationStatus === "verified" && !content.isGuideIndexable(record)) errors.push(`${record.id} is verified but not indexable`);
  });
  content.sources.forEach((record) => {
    requireIds(record.id, record.marketIds, marketIds);
    if (record.verificationStatus === "verified" && record.kind === "editorial-placeholder") errors.push(`${record.id} cannot verify a placeholder`);
    if (record.verificationStatus === "verified" && !record.url?.startsWith("https://")) errors.push(`${record.id} is verified without HTTPS`);
    if (record.verificationStatus === "verified" && !isIsoDate(record.lastReviewed)) errors.push(`${record.id} has no valid review date`);
    if (record.verificationStatus === "verified" && (!Number.isInteger(record.reviewIntervalDays) || (record.reviewIntervalDays ?? 0) <= 0)) errors.push(`${record.id} has no review interval`);
  });
  const citedSourceIds = new Set(content.evidenceClaims.flatMap((record) => record.sourceIds));
  content.sources.forEach((record) => {
    if (!citedSourceIds.has(record.id)) errors.push(`${record.id} is not cited by any evidence claim`);
  });
  const nodeIds = ids(content.troubleshooterNodes);
  if (!nodeIds.has("start")) errors.push("troubleshooter has no start node");
  content.troubleshooterNodes.forEach((record) => {
    if (record.kind === "question") requireIds(record.id, record.options.map((option) => option.nextNodeId), nodeIds);
  });
  content.searchItems.forEach((record) => {
    if (!record.href.startsWith(`/${content.locale}/`)) errors.push(`${record.id} leaves active locale`);
  });
  if (errors.length) throw new Error(`Invalid FixLookup content (${content.locale}):\n${errors.join("\n")}`);
}
