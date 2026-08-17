import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { shouldBlockIndexing } from "@/lib/deployment.mjs";

export default function robots(): MetadataRoute.Robots {
  if (shouldBlockIndexing()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
