import { productionSiteOrigin } from "./deployment.mjs";

export const siteConfig = {
  name: "FixLookup",
  url: productionSiteOrigin,
  primaryCategoryId: "category-dishwashers",
  governanceLastReviewed: "2026-08-17",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
