import type { Metadata } from "next";
import { openGraphLocales, type Locale } from "./i18n/config";
import { localizedAlternates } from "./i18n/routing";
import { absoluteUrl, siteConfig } from "./site";
import { shouldBlockIndexing } from "./deployment.mjs";

interface PageMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  pathForLocale?: (locale: Locale) => string | undefined;
  noIndex?: boolean;
  openGraphType?: "website" | "article";
  includeSiteImage?: boolean;
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  pathForLocale = () => path,
  noIndex = false,
  openGraphType = "website",
  includeSiteImage = true,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  const preventIndexing = noIndex || shouldBlockIndexing();
  const socialImages = includeSiteImage ? [{
    url: absoluteUrl("/og.png"),
    width: 1731,
    height: 909,
    alt: socialTitle,
  }] : [];
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: localizedAlternates(pathForLocale),
    },
    robots: preventIndexing ? { index: false, follow: false, nocache: true } : undefined,
    openGraph: {
      type: openGraphType,
      siteName: siteConfig.name,
      locale: openGraphLocales[locale],
      title: socialTitle,
      description,
      url: path,
      images: socialImages,
    },
    twitter: {
      card: includeSiteImage ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      images: includeSiteImage ? [absoluteUrl("/og.png")] : [],
    },
  };
}
