import type { MetadataRoute } from "next";
import { getCachedContent } from "@/lib/content";
import { defaultLocale, supportedLocales, type Locale } from "@/lib/i18n/config";
import { localizedAlternates, paths } from "@/lib/i18n/routing";
import { latestReviewDate } from "@/lib/review";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface SitemapEntry {
  path: string;
  priority: number;
  lastModified?: string;
  pathForLocale: (locale: typeof defaultLocale) => string | undefined;
}

const governancePaths = [
  { priority: 0.4, path: paths.about },
  { priority: 0.4, path: paths.editorial },
  { priority: 0.4, path: paths.safety },
  { priority: 0.3, path: paths.contact },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    const publishedGuides = content.guides.filter(content.isGuideIndexable);
    const siteLastModified = latestReviewDate(publishedGuides.map((guide) => guide.lastReviewed));
    const staticEntries: SitemapEntry[] = [
      { path: paths.home(locale), priority: 1, lastModified: siteLastModified, pathForLocale: (candidate) => paths.home(candidate) },
      { path: paths.devices(locale), priority: 0.8, lastModified: siteLastModified, pathForLocale: (candidate) => paths.devices(candidate) },
      ...governancePaths.map((record) => ({
        path: record.path(locale),
        priority: record.priority,
        lastModified: siteConfig.governanceLastReviewed,
        pathForLocale: (candidate: Locale) => record.path(candidate),
      })),
    ];

    const categoryEntries = content.deviceCategories.flatMap((category): SitemapEntry[] => {
      if (!content.categoryHasIndexableContent(category.id)) return [];
      const categoryLastModified = latestReviewDate(
        publishedGuides.filter((guide) => guide.categoryId === category.id).map((guide) => guide.lastReviewed),
      );
      const categoryEntry: SitemapEntry = {
        path: paths.category(locale, category),
        priority: 0.9,
        lastModified: categoryLastModified,
        pathForLocale: (candidate) => {
          const candidateContent = getCachedContent(candidate);
          const localized = candidateContent.getCategoryById(category.id);
          return localized && candidateContent.categoryHasIndexableContent(localized.id)
            ? paths.category(candidate, localized)
            : undefined;
        },
      };

      const manufacturers: SitemapEntry[] = content.manufacturers
        .filter((record) => record.categoryIds.includes(category.id) && content.manufacturerHasIndexableContent(record.id, category.id))
        .map((manufacturer) => {
          const guideDates = [
            ...content.errorCodes
              .filter((code) => code.categoryId === category.id && code.manufacturerId === manufacturer.id && content.isErrorCodeIndexable(code))
              .map((code) => content.getGuideById(code.guideId)?.lastReviewed),
            ...content.models
              .filter((model) => model.categoryId === category.id && model.manufacturerId === manufacturer.id && content.isModelIndexable(model))
              .flatMap((model) => model.guideIds.map((id) => content.getGuideById(id)?.lastReviewed)),
          ];
          return {
            path: paths.manufacturer(locale, category, manufacturer),
            priority: 0.7,
            lastModified: latestReviewDate(guideDates),
            pathForLocale: (candidate) => {
              const candidateContent = getCachedContent(candidate);
              const localizedCategory = candidateContent.getCategoryById(category.id);
              const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
              return localizedCategory && localizedManufacturer &&
                candidateContent.manufacturerHasIndexableContent(localizedManufacturer.id, localizedCategory.id)
                ? paths.manufacturer(candidate, localizedCategory, localizedManufacturer)
                : undefined;
            },
          };
        });

      const models: SitemapEntry[] = content.models
        .filter((model) => model.categoryId === category.id && content.isModelIndexable(model))
        .flatMap((model) => {
          const manufacturer = content.getManufacturerById(model.manufacturerId);
          if (!manufacturer) return [];
          return [{
            path: paths.model(locale, category, manufacturer, model),
            priority: 0.7,
            lastModified: latestReviewDate(model.guideIds.map((id) => content.getGuideById(id)?.lastReviewed)),
            pathForLocale: (candidate) => {
              const candidateContent = getCachedContent(candidate);
              const localizedCategory = candidateContent.getCategoryById(category.id);
              const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
              const localizedModel = candidateContent.models.find((record) => record.id === model.id);
              return localizedCategory && localizedManufacturer && localizedModel && candidateContent.isModelIndexable(localizedModel)
                ? paths.model(candidate, localizedCategory, localizedManufacturer, localizedModel)
                : undefined;
            },
          }];
        });

      const problems: SitemapEntry[] = content.problems
        .filter((problem) => problem.categoryId === category.id && content.isProblemIndexable(problem))
        .map((problem) => ({
          path: paths.problem(locale, category, problem),
          priority: 0.7,
          lastModified: content.getGuideById(problem.guideId)?.lastReviewed ?? undefined,
          pathForLocale: (candidate) => {
            const candidateContent = getCachedContent(candidate);
            const localizedCategory = candidateContent.getCategoryById(category.id);
            const localizedProblem = candidateContent.getProblemById(problem.id);
            return localizedCategory && localizedProblem && candidateContent.isProblemIndexable(localizedProblem)
              ? paths.problem(candidate, localizedCategory, localizedProblem)
              : undefined;
          },
        }));

      const codes: SitemapEntry[] = content.errorCodes
        .filter((code) => code.categoryId === category.id && content.isErrorCodeIndexable(code))
        .flatMap((code) => {
          const manufacturer = content.getManufacturerById(code.manufacturerId);
          if (!manufacturer) return [];
          return [{
            path: paths.errorCode(locale, category, manufacturer, code),
            priority: 0.7,
            lastModified: content.getGuideById(code.guideId)?.lastReviewed ?? undefined,
            pathForLocale: (candidate) => {
              const candidateContent = getCachedContent(candidate);
              const localizedCategory = candidateContent.getCategoryById(category.id);
              const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
              const localizedCode = candidateContent.errorCodes.find((record) => record.id === code.id);
              return localizedCategory && localizedManufacturer && localizedCode && candidateContent.isErrorCodeIndexable(localizedCode)
                ? paths.errorCode(candidate, localizedCategory, localizedManufacturer, localizedCode)
                : undefined;
            },
          }];
        });

      return [categoryEntry, ...manufacturers, ...models, ...problems, ...codes];
    });

    return [...staticEntries, ...categoryEntries];
  });

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: entry.lastModified,
    changeFrequency: entry.priority === 1 ? "weekly" : "monthly",
    priority: entry.priority,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(localizedAlternates(entry.pathForLocale)).map(([language, path]) => [language, absoluteUrl(path)]),
      ),
    },
  }));
}
