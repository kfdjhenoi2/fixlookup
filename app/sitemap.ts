import type { MetadataRoute } from "next";
import { getCachedContent } from "@/lib/content";
import { defaultLocale, supportedLocales } from "@/lib/i18n/config";
import { localizedAlternates, paths } from "@/lib/i18n/routing";
import { absoluteUrl } from "@/lib/site";

interface SitemapEntry {
  path: string;
  priority: number;
  pathForLocale: (locale: typeof defaultLocale) => string | undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = supportedLocales.flatMap((locale) => {
    const content = getCachedContent(locale);
    const category = content.deviceCategories[0];
    const staticEntries: SitemapEntry[] = [
      { path: paths.home(locale), priority: 1, pathForLocale: (candidate) => paths.home(candidate) },
      { path: paths.devices(locale), priority: 0.8, pathForLocale: (candidate) => paths.devices(candidate) },
      {
        path: paths.category(locale, category),
        priority: 0.9,
        pathForLocale: (candidate) => {
          const localized = getCachedContent(candidate).getCategoryById(category.id);
          return localized ? paths.category(candidate, localized) : undefined;
        },
      },
    ];
    const manufacturers: SitemapEntry[] = content.manufacturers
      .filter((record) => content.manufacturerHasIndexableContent(record.id))
      .map((manufacturer) => ({
        path: paths.manufacturer(locale, category, manufacturer),
        priority: 0.7,
        pathForLocale: (candidate) => {
          const candidateContent = getCachedContent(candidate);
          const localizedCategory = candidateContent.getCategoryById(category.id);
          const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
          return localizedCategory && localizedManufacturer ? paths.manufacturer(candidate, localizedCategory, localizedManufacturer) : undefined;
        },
      }));
    const models: SitemapEntry[] = content.models.filter(content.isModelIndexable).flatMap((model) => {
      const manufacturer = content.getManufacturerById(model.manufacturerId);
      return manufacturer ? [{
        path: paths.model(locale, category, manufacturer, model),
        priority: 0.7,
        pathForLocale: (candidate) => {
          const candidateContent = getCachedContent(candidate);
          const localizedCategory = candidateContent.getCategoryById(category.id);
          const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
          const localizedModel = candidateContent.models.find((record) => record.id === model.id);
          return localizedCategory && localizedManufacturer && localizedModel ? paths.model(candidate, localizedCategory, localizedManufacturer, localizedModel) : undefined;
        },
      }] : [];
    });
    const problems: SitemapEntry[] = content.problems.filter(content.isProblemIndexable).map((problem) => ({
      path: paths.problem(locale, category, problem),
      priority: 0.7,
      pathForLocale: (candidate) => {
        const candidateContent = getCachedContent(candidate);
        const localizedCategory = candidateContent.getCategoryById(category.id);
        const localizedProblem = candidateContent.getProblemById(problem.id);
        return localizedCategory && localizedProblem ? paths.problem(candidate, localizedCategory, localizedProblem) : undefined;
      },
    }));
    const codes: SitemapEntry[] = content.errorCodes.filter(content.isErrorCodeIndexable).flatMap((code) => {
      const manufacturer = content.getManufacturerById(code.manufacturerId);
      return manufacturer ? [{
        path: paths.errorCode(locale, category, manufacturer, code),
        priority: 0.7,
        pathForLocale: (candidate) => {
          const candidateContent = getCachedContent(candidate);
          const localizedCategory = candidateContent.getCategoryById(category.id);
          const localizedManufacturer = candidateContent.getManufacturerById(manufacturer.id);
          const localizedCode = candidateContent.errorCodes.find((record) => record.id === code.id);
          return localizedCategory && localizedManufacturer && localizedCode ? paths.errorCode(candidate, localizedCategory, localizedManufacturer, localizedCode) : undefined;
        },
      }] : [];
    });
    return [...staticEntries, ...manufacturers, ...models, ...problems, ...codes];
  });

  return entries.map((entry) => ({
    url: absoluteUrl(entry.path),
    changeFrequency: entry.priority === 1 ? "weekly" : "monthly",
    priority: entry.priority,
    alternates: {
      languages: Object.fromEntries(
        Object.entries(localizedAlternates(entry.pathForLocale)).map(([language, path]) => [language, absoluteUrl(path)]),
      ),
    },
  }));
}
