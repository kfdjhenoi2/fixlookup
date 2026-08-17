import { en } from "./en";
import type { Locale } from "./config";
import type { LocaleContent } from "./types";

const localeContent: Record<Locale, LocaleContent> = { en };

function assertSameShape(reference: unknown, candidate: unknown, path: string) {
  if (!reference || typeof reference !== "object" || Array.isArray(reference)) return;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error(`Incomplete locale data at ${path}`);
  }
  const referenceKeys = Object.keys(reference);
  const candidateKeys = Object.keys(candidate);
  for (const key of referenceKeys) {
    if (!candidateKeys.includes(key)) throw new Error(`Missing locale key ${path}.${key}`);
    assertSameShape(
      (reference as Record<string, unknown>)[key],
      (candidate as Record<string, unknown>)[key],
      `${path}.${key}`,
    );
  }
}

Object.entries(localeContent).forEach(([locale, content]) => {
  assertSameShape(en, content, locale);
});

export function getLocaleContent(locale: Locale): LocaleContent {
  return localeContent[locale];
}
