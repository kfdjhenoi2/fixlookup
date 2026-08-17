import type { DeviceCategory, DeviceModel, ErrorCode, Manufacturer, Problem } from "../types";
import type { Locale } from "./config";
import { defaultLocale, supportedLocales } from "./config";
import { getLocaleContent } from "./index";

const withTrailingSlash = (parts: string[]) => `/${parts.filter(Boolean).join("/")}/`;

export const paths = {
  home: (locale: Locale) => withTrailingSlash([locale]),
  devices: (locale: Locale) => withTrailingSlash([locale, getLocaleContent(locale).routes.devices]),
  category: (locale: Locale, category: DeviceCategory) => withTrailingSlash([locale, category.slug]),
  manufacturer: (locale: Locale, category: DeviceCategory, manufacturer: Manufacturer) =>
    withTrailingSlash([locale, category.slug, manufacturer.slug]),
  model: (locale: Locale, category: DeviceCategory, manufacturer: Manufacturer, model: DeviceModel) =>
    withTrailingSlash([locale, category.slug, manufacturer.slug, getLocaleContent(locale).routes.models, model.slug]),
  problem: (locale: Locale, category: DeviceCategory, problem: Problem) =>
    withTrailingSlash([locale, category.slug, getLocaleContent(locale).routes.problems, problem.slug]),
  errorCode: (locale: Locale, category: DeviceCategory, manufacturer: Manufacturer, errorCode: ErrorCode) =>
    withTrailingSlash([locale, category.slug, manufacturer.slug, errorCode.slug]),
  troubleshooter: (locale: Locale, category: DeviceCategory) =>
    withTrailingSlash([locale, category.slug, getLocaleContent(locale).routes.troubleshooter]),
  about: (locale: Locale) => withTrailingSlash([locale, getLocaleContent(locale).routes.about]),
  editorial: (locale: Locale) => withTrailingSlash([locale, getLocaleContent(locale).routes.editorial]),
  safety: (locale: Locale) => withTrailingSlash([locale, getLocaleContent(locale).routes.safety]),
  contact: (locale: Locale) => withTrailingSlash([locale, getLocaleContent(locale).routes.contact]),
};

export function localizedAlternates(pathForLocale: (locale: Locale) => string | undefined) {
  const languages = Object.fromEntries(
    supportedLocales.flatMap((locale) => {
      const path = pathForLocale(locale);
      return path ? [[locale, path]] : [];
    }),
  );
  const defaultPath = pathForLocale(defaultLocale);
  return defaultPath ? { ...languages, "x-default": defaultPath } : languages;
}
