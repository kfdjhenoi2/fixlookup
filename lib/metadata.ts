import type { Metadata } from "next";
import { openGraphLocales, type Locale } from "./i18n/config";
import { localizedAlternates } from "./i18n/routing";
import { absoluteUrl, siteConfig } from "./site";

interface PageMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  pathForLocale?: (locale: Locale) => string | undefined;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  pathForLocale = () => path,
  noIndex = false,
  openGraphType = "website",
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: localizedAlternates(pathForLocale),
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: openGraphType,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      title: socialTitle,
      description,
      url: path,
      images: [{
        url: absoluteUrl("/og.png"),
        width: 1731,
        height: 909,
        alt: `${title} | ${siteConfig.name}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteUrl("/og.png")],
    },
  };
}
