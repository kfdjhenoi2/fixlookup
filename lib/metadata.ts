import type { Metadata } from "next";
import { absoluteUrl } from "./site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const socialTitle = `${title} | FixOrReplace`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url: path,
      images: [
        {
          url: absoluteUrl("/og.png"),
          width: 1731,
          height: 909,
          alt: "FixOrReplace — Evidence before answers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteUrl("/og.png")],
    },
  };
}
