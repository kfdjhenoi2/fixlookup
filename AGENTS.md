# FixOrReplace

## Mission

Build FixOrReplace into a trustworthy, structured and eventually largely autonomous troubleshooting database for household appliances and consumer devices.

Long-term goal:

Become a search engine for device problems.

Users should be able to search for a device, model, symptom or error code and receive verified troubleshooting information.

This must NOT become an AI-generated content farm.

Quality, usefulness, safety and verifiable information come before content volume.

## Initial scope

Start with dishwashers.

Initial brands:
- Bosch
- Siemens
- Electrolux
- Whirlpool
- Samsung

The architecture must support additional device categories later.

Do not mass-generate pages.

Start with a small, coherent and high-quality content cluster.

## Technology

Default stack:

- Next.js
- TypeScript
- React
- Git
- Vercel-compatible architecture

Prefer simple architecture over unnecessary abstractions.

Use structured data for:
- device categories
- manufacturers
- model families
- models
- problems
- error codes
- troubleshooting guides
- sources
- safety classifications

Do not create duplicate content for individual models when multiple models share the same underlying problem or guide.

## Internationalization

- Keep one language-independent technical knowledge base keyed by stable IDs. Never duplicate technical claims, source relationships, safety levels or compatibility data per locale.
- Keep localized copy, UI labels, metadata and slugs in locale modules. A translation must preserve the reviewed technical meaning and source boundary.
- Every public page uses a locale prefix (`/en/`, later `/fi/`, etc.). `/` redirects to the default locale; do not infer locale from IP address.
- `supportedLocales` is the publication gate. Do not create routes, sitemap entries, canonicals or `hreflang` alternates for a locale until its complete localized dataset is reviewed and enabled.
- Build internal links, search results and troubleshooter presentation with the active locale. Resolve localized routes by stable entity ID, not by translating URLs ad hoc.

## Information quality

Never invent:

- error code meanings
- model compatibility
- technical specifications
- repair procedures
- electrical information
- component compatibility
- manufacturer claims

Preferred sources:

1. Manufacturer documentation
2. Manufacturer support websites
3. Official product manuals
4. Public official service documentation
5. Reputable technical sources when primary sources are unavailable

Technical claims must be traceable to sources.

If reliable information cannot be found, omit the claim or mark the data as requiring review.

## Safety

Do not provide unsafe DIY instructions.

High-risk topics include:
- mains electrical repair
- gas appliance repair
- high-voltage components
- dangerous internal electrical work
- repairs with significant fire or electrocution risk

Safe user-level troubleshooting is preferred.

High-risk instructions require human review or must not be provided.

## UX

The website should feel like a technical troubleshooting tool, not an affiliate blog.

Primary experiences:

- device/problem search
- browse by device and manufacturer
- error-code pages
- model pages
- problem pages
- interactive troubleshooting
- related problems
- source references

Design mobile-first because users may use the website while standing next to the appliance.

Avoid:
- generic AI visuals
- fake reviews
- fake statistics
- excessive animations
- aggressive advertising

## SEO

Optimize for real user problems.

Examples:

- Bosch dishwasher E15
- dishwasher not draining
- Samsung dishwasher error code
- Bosch SMV4HVX31E E15

Use:
- correct titles
- descriptions
- canonical URLs
- headings
- breadcrumbs
- structured data where appropriate
- internal linking
- related pages
- sitemap

Never keyword-stuff or generate thin pages just to target keyword combinations.

## Monetization architecture

Prepare for future:

- affiliate links
- replacement parts
- replacement appliances
- display advertising
- repair-service leads

Do not prioritize monetization over troubleshooting usefulness.

Do not sign up for paid services or affiliate programs without human approval.

Affiliate destinations should eventually be centrally managed rather than hardcoded into many articles.

## Autonomous maintenance goal

The future workflow is:

Search Console + Analytics
→ opportunity analysis
→ research
→ content/database change
→ validation
→ tests
→ Git branch
→ Pull Request
→ human approval
→ deployment

Target autonomy level is eventually Level 4:

Routine low-risk maintenance can be automated, while significant or risky changes require human approval.

Do not implement full autonomous publishing yet.

Begin at Level 2:

Codex implements changes, validates them and presents them for human review.

## Engineering rules

Before considering work complete:

- run the build
- run TypeScript checks
- run linting
- run relevant tests
- check for obvious broken links
- review the changed files
- verify no secrets/API keys were added
- verify technical information has sources
- verify no unsafe instructions were introduced

Fix failures before presenting the result.

## Approval boundaries

Do not without human approval:

- publish to production
- buy anything
- register domains
- activate paid APIs
- sign affiliate agreements
- enable autonomous production publishing
- delete substantial existing work
- introduce potentially unsafe repair instructions

Normal implementation decisions can be made independently.

## Working style

Do not repeatedly ask what to do next.

Inspect the repository, make reasonable engineering decisions and continue through the logical implementation steps.

Ask for approval only when reaching an approval boundary.

At meaningful milestones report:

- Completed
- Why
- Validation
- Risks / unresolved items
- Next recommended task
