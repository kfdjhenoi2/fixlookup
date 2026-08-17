export const productionSiteOrigin = "https://fixlookup.com";

/**
 * Vercel exposes VERCEL_ENV as production, preview, or development. Other
 * hosts can opt into the same protection with FIXLOOKUP_NOINDEX=1.
 * Local development leaves both values unset and continues to work normally.
 *
 * @param {Record<string, string | undefined>} environment
 */
export function shouldBlockIndexing(environment = process.env) {
  const forced = environment.FIXLOOKUP_NOINDEX?.toLowerCase();
  if (forced === "1" || forced === "true") return true;

  const vercelEnvironment = environment.VERCEL_ENV;
  return Boolean(vercelEnvironment && vercelEnvironment !== "production");
}
