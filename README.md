# FixOrReplace

FixOrReplace is a source-aware troubleshooting index for household appliances and consumer devices. The MVP focuses on a deliberately small dishwasher cluster: eight shared problem guides and nine manufacturer error-code records backed by primary sources.

## Architecture

- `app/` contains server-rendered routes, metadata, sitemap, and robots output.
- `components/` contains reusable UI plus the two client-side interactions: search and the troubleshooting flow.
- `lib/types.ts` defines the normalized content entities.
- `lib/data/` contains reviewed dishwasher records and primary-source references.
- `lib/content.ts` provides publication gates, search indexing, and relationship validation.
- `tests/` validates rendered routes, core templates, SEO output, and internal links.

The content layer is intentionally static for the MVP. Its stable entity IDs and explicit relationships make it straightforward to move to a database or content pipeline without changing route semantics. Standard Next.js is the default development and production target; the retained vinext configuration provides a separate Sites-compatible build.

## Local development

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical site origin before a production build. The local fallback is `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
npm run build:sites
npm test
```

Unverified records are marked `noindex` and excluded from the sitemap. No model records are published until exact model identity and compatibility can be sourced; manufacturer code pages explicitly avoid inferring model compatibility. The interactive framework remains `noindex` because it is a navigation aid rather than a standalone technical guide.
