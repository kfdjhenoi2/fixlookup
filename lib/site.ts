export const siteConfig = {
  name: "FixLookup",
  url: "https://fixlookup.com",
} as const;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
