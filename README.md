# FixLookup

FixLookup is a source-aware troubleshooting index for household appliances and consumer devices. The MVP focuses on a deliberately small dishwasher cluster: eight shared problem guides and nine manufacturer error-code records backed by primary sources.

## Architecture

- `app/` contains locale-prefixed server-rendered routes, metadata, sitemap, and robots output. `/` permanently redirects to `/en/`.
- `components/` contains reusable UI plus the two client-side interactions: search and the troubleshooting flow.
- `lib/types.ts` defines the normalized content entities.
- `lib/data/` contains the language-independent dishwasher knowledge graph and primary-source relationships.
- `lib/i18n/` contains supported-locale configuration, localized slugs, UI/SEO copy, and entity presentation records.
- `lib/content.ts` joins knowledge to a locale and provides publication gates, locale-aware search indexing, and relationship validation.
- `tests/` validates rendered routes, core templates, SEO output, and internal links.

The content layer is intentionally static for the MVP. Its stable entity IDs and explicit relationships make it straightforward to move to a database or content pipeline without changing route semantics. Standard Next.js is the default development and production target; the retained vinext configuration provides a separate Sites-compatible build.

English is the only enabled locale. To add another language, create a complete locale module matching `lib/i18n/en.ts`, register it in `lib/i18n/index.ts`, then add its code to `supportedLocales` in `lib/i18n/config.ts`. Routes, search, sitemap entries, canonicals, and language alternates are generated only for enabled locales.

## Local development

```bash
npm install
npm run dev
```

The canonical origin is pinned to `https://fixlookup.com` so local and preview builds cannot publish competing SEO URLs.

## Publication boundary

Only records with `verificationStatus: "verified"`, verified source relationships, valid review metadata, and a complete indexable guide may appear on public routes. Draft records marked `demo` or `needs-review`, and fictional model/code records, remain in the editorial data model but are excluded from route generation, direct route resolution, search, listings, related links, metadata, structured data, and the sitemap. They return 404 if requested directly.

## Production and preview indexing

`https://fixlookup.com` is the single canonical origin. Vercel deployments with `VERCEL_ENV=preview` or `VERCEL_ENV=development` receive page-level `noindex`, a disallowing `robots.txt`, and an `X-Robots-Tag` response header. Vercel production remains indexable. Other preview hosts can enable the same protection with `FIXLOOKUP_NOINDEX=1`. Local development leaves these variables unset and behaves normally.

Security headers are centralized in `lib/security.mjs` and applied through standard Next.js configuration. The policy permits the current Next.js runtime while keeping external scripts and connections closed by default. A future analytics rollout should extend `script-src` and `connect-src` deliberately rather than weakening the full policy.

## Editorial governance

The public trust pages cover FixLookup's scope, editorial and sourcing policy, safety boundary, corrections, and contact structure. Verified guides and sources must include a valid `lastReviewed` date and positive review interval. The current default interval is 365 days; review-due dates are derived rather than invented separately.

No correction inbox is currently published. The public contact page uses neutral availability copy until a real correction channel is activated and tested.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
npm run build:sites
npm test
npm run test:preview
npm run scan:secrets
npm audit --omit=dev --audit-level=high
```

GitHub Actions runs the locked install, secret-pattern scan, typecheck, lint, Next.js production build, rendered tests, portable hosting build, and production dependency audit on pull requests and pushes to `main`.

After the first successful workflow run, manually protect `main`: require pull requests, require the `quality` status check, require branches to be up to date, dismiss stale approvals, block force pushes and deletion, and restrict direct pushes to the repository owner or release maintainers. Keep deployment approval separate from merge approval.

## Hosting portability

Standard Next.js remains the primary Vercel-compatible production target. The retained Vinext/Vite/Worker configuration provides a secondary Cloudflare-compatible build and has no database or object-storage bindings. Non-Vercel preview deployments must set `FIXLOOKUP_NOINDEX=1`; production deployments on another host should leave it unset and preserve the canonical origin.

Unverified records are unpublished and return 404 rather than relying on `noindex`. No model records are published until exact model identity and compatibility can be sourced; manufacturer code pages explicitly avoid inferring model compatibility. The interactive framework remains `noindex` because it is a navigation aid rather than a standalone technical guide.
