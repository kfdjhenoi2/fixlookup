import type { Metadata } from "next";
import type { Locale } from "./i18n/config";
import { localizedAlternates } from "./i18n/routing";
import { absoluteUrl } from "./site";

interface PageMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  pathForLocale?: (locale: Locale) => string | undefined;
  noIndex?: boolean;
}

export function createPageMetadata({
  locale,
  title,
  description,
  path,
  pathForLocale = () => path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | FixOrReplace`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: localizedAlternates(pathForLocale),
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale,
      title: socialTitle,
      description,
      url: path,
      images: [{
        url: absoluteUrl("/og.png"),
        width: 1731,
        height: 909,
        alt: `${title} | FixOrReplace`,
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
