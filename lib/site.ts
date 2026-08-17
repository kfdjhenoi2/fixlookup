function normalizeSiteUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/$/, "");
}

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "http://localhost:3000";

export const siteConfig = {
  name: "FixOrReplace",
  url: normalizeSiteUrl(configuredUrl),
};

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
