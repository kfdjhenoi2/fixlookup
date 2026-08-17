import assert from "node:assert/strict";
import test from "node:test";
import { shouldBlockIndexing, productionSiteOrigin } from "../lib/deployment.mjs";
import { isVerifiedForPublication, verifiedForPublication } from "../lib/publication.mjs";
import { createSecurityHeaders } from "../lib/security.mjs";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const expectedOrigin = productionSiteOrigin;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const problemPaths = [
  "/en/dishwashers/problems/dishwasher-not-draining/",
  "/en/dishwashers/problems/dishwasher-not-filling-with-water/",
  "/en/dishwashers/problems/dishwasher-leaking/",
  "/en/dishwashers/problems/dishwasher-will-not-start/",
  "/en/dishwashers/problems/dishwasher-not-cleaning/",
  "/en/dishwashers/problems/dishwasher-not-drying/",
  "/en/dishwashers/problems/white-residue-on-dishes/",
  "/en/dishwashers/problems/dishwasher-tablet-not-dissolving/",
  "/en/dishwashers/problems/dishwasher-making-unusual-noise/",
  "/en/dishwashers/problems/dishwasher-door-will-not-close/",
  "/en/dishwashers/problems/dishwasher-has-no-power/",
  "/en/dishwashers/problems/dishwasher-not-heating-water/",
  "/en/dishwashers/problems/dishwasher-excessive-foam-suds/",
  "/en/dishwashers/problems/dishwasher-smells-bad/",
];

const errorCodePaths = [
  "/en/dishwashers/bosch/e15/",
  "/en/dishwashers/bosch/e24/",
  "/en/dishwashers/bosch/e12/",
  "/en/dishwashers/bosch/e16/",
  "/en/dishwashers/bosch/e18/",
  "/en/dishwashers/bosch/e22/",
  "/en/dishwashers/bosch/e25/",
  "/en/dishwashers/siemens/e15/",
  "/en/dishwashers/siemens/e12/",
  "/en/dishwashers/siemens/e14/",
  "/en/dishwashers/siemens/e16/",
  "/en/dishwashers/siemens/e18/",
  "/en/dishwashers/siemens/e22/",
  "/en/dishwashers/siemens/e24/",
  "/en/dishwashers/electrolux/i20/",
  "/en/dishwashers/electrolux/i30/",
  "/en/dishwashers/electrolux/i10/",
  "/en/dishwashers/electrolux/i40/",
  "/en/dishwashers/electrolux/if0/",
  "/en/dishwashers/samsung/4c-4e/",
  "/en/dishwashers/samsung/5c-5e/",
  "/en/dishwashers/samsung/lc-le/",
  "/en/dishwashers/samsung/oc/",
  "/en/dishwashers/whirlpool/f8e4/",
  "/en/dishwashers/whirlpool/f9e1/",
  "/en/dishwashers/whirlpool/h2o/",
  "/en/dishwashers/lg/ae/",
  "/en/dishwashers/lg/ie/",
  "/en/dishwashers/lg/oe/",
];

const manufacturerPaths = [
  "/en/dishwashers/bosch/",
  "/en/dishwashers/siemens/",
  "/en/dishwashers/electrolux/",
  "/en/dishwashers/whirlpool/",
  "/en/dishwashers/samsung/",
  "/en/dishwashers/lg/",
  "/en/dishwashers/ge/",
  "/en/dishwashers/miele/",
  "/en/dishwashers/beko/",
];

const modelPaths = [
  "/en/dishwashers/bosch/models/shx78cm5n-01/",
  "/en/dishwashers/siemens/models/sn25m889eu-55/",
  "/en/dishwashers/siemens/models/sn25m244eu-b3/",
  "/en/dishwashers/samsung/models/dw60dg760b00u1/",
  "/en/dishwashers/samsung/models/dw60a6090bb-ef/",
  "/en/dishwashers/samsung/models/dw60m5050fw-eu/",
  "/en/dishwashers/lg/models/ldph7972s-assesna/",
  "/en/dishwashers/ge/models/pdt715synfs/",
  "/en/dishwashers/miele/models/g-5150-scvi-active/",
  "/en/dishwashers/beko/models/bdin16n30s/",
  "/en/dishwashers/beko/models/bdis38050q/",
];

const governancePaths = [
  "/en/about/",
  "/en/editorial-policy/",
  "/en/safety/",
  "/en/privacy/",
  "/en/contact/",
];

const indexablePaths = [
  "/en/",
  "/en/devices/",
  ...governancePaths,
  "/en/dishwashers/",
  ...manufacturerPaths,
  ...modelPaths,
  ...problemPaths,
  ...errorCodePaths,
];

function render(path = "/") {
  return worker.fetch(
    new Request(new URL(path, "http://localhost"), { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function expectPage(path, patterns) {
  const response = await render(path);
  assert.equal(response.status, 200, `${path} should render successfully`);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  for (const pattern of patterns) assert.match(html, pattern);
  return html;
}

function jsonLdRecords(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

test("publication helper admits only reviewed, non-fictional records", () => {
  const records = [
    { id: "published", verificationStatus: "verified", isFictional: false },
    { id: "demo", verificationStatus: "demo", isFictional: true },
    { id: "review", verificationStatus: "needs-review", isFictional: false },
    { id: "fictional", verificationStatus: "verified", isFictional: true },
  ];
  assert.equal(isVerifiedForPublication(records[0]), true);
  assert.deepEqual(verifiedForPublication(records).map((record) => record.id), ["published"]);
});

test("deployment policy blocks previews without changing the production origin", () => {
  assert.equal(productionSiteOrigin, "https://fixlookup.com");
  assert.equal(shouldBlockIndexing({ VERCEL_ENV: "production" }), false);
  assert.equal(shouldBlockIndexing({ VERCEL_ENV: "preview" }), true);
  assert.equal(shouldBlockIndexing({ VERCEL_ENV: "development" }), true);
  assert.equal(shouldBlockIndexing({ FIXLOOKUP_NOINDEX: "1" }), true);
  assert.equal(shouldBlockIndexing({}), false);
});

test("security policy includes browser hardening and preview robots protection", () => {
  const production = Object.fromEntries(createSecurityHeaders().map(({ key, value }) => [key, value]));
  assert.match(production["Content-Security-Policy"], /default-src 'self'/);
  assert.match(production["Content-Security-Policy"], /object-src 'none'/);
  assert.match(production["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.match(production["Content-Security-Policy"], /script-src[^;]*https:\/\/www\.googletagmanager\.com/);
  assert.match(production["Content-Security-Policy"], /connect-src[^;]*https:\/\/\*\.google-analytics\.com/);
  assert.match(production["Content-Security-Policy"], /img-src[^;]*https:\/\/\*\.google-analytics\.com/);
  assert.doesNotMatch(production["Content-Security-Policy"], /doubleclick|googleadservices/i);
  assert.equal(production["X-Content-Type-Options"], "nosniff");
  assert.equal(production["X-Frame-Options"], "DENY");
  assert.equal(production["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(production["Permissions-Policy"], /camera=\(\)/);
  assert.match(production["Strict-Transport-Security"], /^max-age=/);
  assert.equal(production["X-Robots-Tag"], undefined);

  const preview = Object.fromEntries(createSecurityHeaders({ blockIndexing: true }).map(({ key, value }) => [key, value]));
  assert.equal(preview["X-Robots-Tag"], "noindex, nofollow, noarchive");
});

test("root and trailing-slash redirects normalize to one locale-aware URL", async () => {
  for (const [path, destination] of [
    ["/", "/en/"],
    ["/en", "/en/"],
    ["/en/devices", "/en/devices/"],
    ["/en/dishwashers", "/en/dishwashers/"],
    ["/en/dishwashers/bosch/e15", "/en/dishwashers/bosch/e15/"],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 308, `${path} should normalize permanently`);
    assert.equal(response.headers.get("location"), destination);
  }

  const home = await expectPage("/en/", [
    /<html lang="en">/,
    /aria-label="FixLookup home"/,
    /<span>FixLookup<\/span>/,
    /Look up what(?:&#x27;|')s wrong with your appliance/,
    /Search by exact model number, error code, or appliance symptom/,
    /Model, error code, or problem/,
    /Bosch E24/,
    /Samsung 5E/,
    /Siemens SN25M889EU\/55/,
    /Dishwasher not draining/,
    /Search by model/,
    /Search by error code/,
    /Search by symptom/,
    /official manufacturer support pages and manuals/,
    /href="\/en\/editorial-policy\/"/,
    /Dishwashers are the only published appliance category for now/,
    /href="\/en\/dishwashers\/"/,
  ]);
  assert.doesNotMatch(home, /href="\/(?:devices|dishwashers)(?:\/|")/);

  for (const path of ["/fi/", "/de/", "/zz/", "/dishwashers/"]) {
    const response = await render(path);
    assert.equal(response.status, 404, `${path} must not be published`);
    const body = await response.text();
    assert.doesNotMatch(body, /rel="canonical"|property="og:url"/);
  }
});

test("robots allows crawling and advertises one canonical sitemap", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain\b/i);
  const robots = await response.text();
  assert.match(robots, /^User-Agent:\s*\*$/im);
  assert.match(robots, /^Allow:\s*\/$/im);
  assert.match(robots, new RegExp(`^Sitemap:\\s*${escapeRegExp(expectedOrigin)}/sitemap\\.xml$`, "im"));
  assert.doesNotMatch(robots, /^Disallow:/im);
  assert.equal((robots.match(/^Sitemap:/gim) ?? []).length, 1);
});

test("server-rendered pages do not include Google Analytics before browser consent", async () => {
  const html = await expectPage("/en/", [/Optional analytics|Look up what/]);
  assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js|_next-ga-init|fixlookup-ga-privacy-bootstrap/);
});

test("renders locale-aware category, manufacturer, and search links", async () => {
  const category = await expectPage("/en/dishwashers/", [
    /Dishwasher troubleshooting/,
    /Choose the name on your appliance/,
    /14(?:<!-- -->)? reviewed topics/,
    /href="\/en\/dishwashers\/bosch\/"/,
    /href="\/en\/dishwashers\/problems\/dishwasher-not-draining\/"/,
  ]);
  assert.ok((category.match(/Source verified/g) ?? []).length >= 14);

  await expectPage("/en/dishwashers/bosch/", [/Bosch(?:<!-- -->)? dishwashers/, /SHX78CM5N\/01/, /Evidence-checked relationship/, /United States/, /E15/, /E24/, /E12/, /E25/]);
  await expectPage("/en/dishwashers/electrolux/", [/Electrolux(?:<!-- -->)? dishwashers/, /i20/, /C2/, /i30/, /i40/, /iF0/]);
  await expectPage("/en/dishwashers/samsung/", [/4C \/ 4E/, /5C \/ 5E/, /LC \/ LE/, /OC \/ 0C \/ oE/]);
  await expectPage("/en/dishwashers/lg/", [/LG(?:<!-- -->)? dishwashers/, /AE \/ EI \/ FE \/ RE/, /IE water-inlet/, /OE water-outlet/]);
  await expectPage("/en/dishwashers/ge/", [/GE Appliances(?:<!-- -->)? dishwashers/, /PDT715SYNFS/, /9 linked topics/]);
  await expectPage("/en/dishwashers/miele/", [/Miele(?:<!-- -->)? dishwashers/, /G 5150 SCVi Active/, /United Kingdom/]);
  await expectPage("/en/dishwashers/beko/", [/Beko(?:<!-- -->)? dishwashers/, /BDIN16N30S/, /BDIS38050Q/, /Germany/, /Slovakia/]);
});

test("exact-model pages expose only evidence-backed relationships and reusable guides", async () => {
  for (const path of modelPaths) {
    const html = await expectPage(path, [
      /Exact dishwasher model record/,
      /Official model documentation/,
      /Evidence checked; not an endorsement/,
      /Applicability boundary/,
      /Safety boundary/,
      /Sources &amp; references/,
      /class="claim-sources"/,
      /"@type":"Product"/,
    ]);
    assert.doesNotMatch(html, /Model family/);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }

  const bosch = await expectPage(modelPaths[0], [/SHX78CM5N\/01/, /No exact error-code relationships are verified/, /10 linked topics|Manual-supported problem topics/]);
  assert.doesNotMatch(bosch, /href="\/en\/dishwashers\/bosch\/e15\/"/);

  await expectPage(modelPaths[1], [/SN25M889EU\/55/, />E12</, />E14</, />E24 \/ E25</, /Ireland/]);
  await expectPage(modelPaths[2], [/SN25M244EU\/B3/, />E15</, /9000911442_H\.pdf/]);
  await expectPage(modelPaths[3], [/DW60DG760B00U1/, />4C</, />5C</, />LC</, /United Kingdom/]);
  await expectPage(modelPaths[4], [/DW60A6090BB\/EF/, />4C</, />LC</]);
  await expectPage(modelPaths[5], [/DW60M5050FW\/EU/, />4C</, />LC</, /Ireland/]);
  await expectPage(modelPaths[6], [/LDPH7972S\.ASSESNA/, />AE \/ FE</, />IE</, />OE</]);
  await expectPage(modelPaths[7], [/PDT715SYNFS/, /No exact error-code relationships are verified/]);
  await expectPage(modelPaths[8], [/G 5150 SCVi Active/, /No exact error-code relationships are verified/]);
});

test("trust pages explain the editorial, safety, correction, and contact boundaries", async () => {
  const expectations = new Map([
    ["/en/about/", [/About FixLookup/, /source-aware troubleshooting/]],
    ["/en/editorial-policy/", [/How FixLookup reviews and publishes technical information/, /What verified means/]],
    ["/en/safety/", [/Safe next steps come before complete instructions/, /Professional-only work/]],
    ["/en/privacy/", [/Analytics is optional and consent-based/, /Google Analytics usage/, /fixlookup\.analytics-consent\.v1/, /Advertising features are disabled/]],
    ["/en/contact/", [/Help keep the record accurate/, /Correction contact will be available soon/, /No correction inbox is currently available/]],
  ]);
  for (const [path, patterns] of expectations) {
    const html = await expectPage(path, [...patterns, /"@type":"WebPage"/]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    if (path === "/en/contact/") {
      assert.doesNotMatch(html, /mailto:|corrections@fixlookup\.com/i);
    }
    if (path === "/en/privacy/") {
      assert.match(html, /href="\/en\/privacy\/"/);
      assert.doesNotMatch(html, /personal data is anonymous|GDPR compliant|legitimate interest/i);
    }
  }
});

test("renders shared guides with claim-level source links and safety labels", async () => {
  const drainage = await expectPage(problemPaths[0], [
    /Shared problem guide/,
    /Safe dishwasher drainage checks/,
    /Sources &amp; references/,
    /Related problems/,
    /Accessed[\s\S]{0,80}2026-08-17/,
    /Last reviewed[\s\S]{0,80}2026-08-17/,
    /Review due[\s\S]{0,80}2027-08-17/,
  ]);
  assert.match(drainage, /href="#source-source-bosch-not-draining"/);
  assert.match(drainage, /id="source-source-bosch-not-draining"/);
  assert.match(drainage, /Clean only the removable filter described in the manual/);

  for (const path of problemPaths) {
    const html = await expectPage(path, [/Source verified/, /Sources &amp; references/, /class="claim-sources"/]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    assert.equal((html.match(/class="claim-sources"/g) ?? []).length, 4, `${path} should cite each step`);
    assert.ok((html.match(/safety-(?:user-safe|caution|professional-only)/g) ?? []).length >= 5, `${path} should retain guide and step safety labels`);
  }
});

test("manufacturer code pages reuse canonical guides rather than duplicate steps", async () => {
  const boschE15 = await expectPage(errorCodePaths[0], [
    /Bosch(?:<!-- -->)? E15/,
    /safety switch detected water/,
    /confirm E15 in the official manual for the exact dishwasher/i,
    /Bosch US dishwasher support/,
    /href="\/en\/dishwashers\/problems\/dishwasher-leaking\/"/,
  ]);
  assert.doesNotMatch(boschE15, /Limit checks to accessible areas/);

  await expectPage("/en/dishwashers/electrolux/i20/", [/i20 drainage error/, /C2, F2, AL6, 2 beeps, 2 LED flashes/, /dishwasher-not-draining/]);
  await expectPage("/en/dishwashers/samsung/4c-4e/", [/4C \/ 4E information code/, /water-supply issue codes/]);
  for (const path of errorCodePaths) {
    const html = await expectPage(path, [/Source verified/, /Applicability boundary/, /Sources &amp; references/, /Source scope/]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
});

test("the nine pre-Phase-1A records keep their established URLs and meanings", async () => {
  const legacyMeanings = new Map([
    ["/en/dishwashers/bosch/e15/", /safety switch detected water in the dishwasher base/],
    ["/en/dishwashers/bosch/e24/", /drainage problem/],
    ["/en/dishwashers/siemens/e15/", /water in the floor tub/],
    ["/en/dishwashers/electrolux/i20/", /signals indicate a drainage problem/],
    ["/en/dishwashers/electrolux/i30/", /internal leak with water in the appliance base/],
    ["/en/dishwashers/samsung/4c-4e/", /water-supply issue codes/],
    ["/en/dishwashers/samsung/5c-5e/", /drainage issue codes/],
    ["/en/dishwashers/samsung/lc-le/", /leak issue codes/],
    ["/en/dishwashers/whirlpool/f8e4/", /water detected in the drip tray/],
  ]);
  for (const [path, meaning] of legacyMeanings) await expectPage(path, [meaning, /Source verified/]);
});

test("all indexable pages have unique locale-aware metadata and valid Open Graph tags", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const path of indexablePaths) {
    const html = await expectPage(path, [
      /hreflang="en"/,
      /hreflang="x-default"/,
      /<meta name="application-name" content="FixLookup"/,
      /property="og:title"/,
      /property="og:description"/,
      /property="og:site_name" content="FixLookup"/,
      /property="og:locale" content="en_US"/,
    ]);
    assert.ok(html.includes(`rel="canonical" href="${expectedOrigin}${path}"`));
    assert.ok(html.includes(`property="og:image" content="${expectedOrigin}/og.png"`));
    assert.doesNotMatch(html, /hreflang="(?:fi|de|es|fr)"/);
    assert.doesNotMatch(html, /FixOrReplace|Fix Or Replace|fix-or-replace/i);
    assert.doesNotMatch(html, /Demo record|Source review needed|fictional template/i);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
    assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${path} should have one canonical`);
    assert.equal((html.match(/hreflang="en"/g) ?? []).length, 1, `${path} should have one English alternate`);
    assert.equal((html.match(/hreflang="x-default"/g) ?? []).length, 1, `${path} should have one x-default alternate`);
    assert.ok(html.includes(`property="og:url" content="${expectedOrigin}${path}"`));
    if (problemPaths.includes(path) || errorCodePaths.includes(path)) {
      assert.match(html, /property="og:type" content="article"/);
    } else {
      assert.match(html, /property="og:type" content="website"/);
    }

    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
    assert.ok(title, `${path} should have a title`);
    assert.ok(description, `${path} should have a description`);
    assert.ok(!titles.has(title), `${path} has duplicate title ${title}`);
    assert.ok(!descriptions.has(description), `${path} has duplicate description`);
    titles.add(title);
    descriptions.add(description);
  }

  const troubleshooter = await expectPage("/en/dishwashers/troubleshooter/", [/Safety and information checklist/, /name="robots" content="noindex, nofollow, nocache"/]);
  assert.match(troubleshooter, /No model compatibility is assumed/);
  assert.doesNotMatch(troubleshooter, /property="og:locale" content="en"/);
});

test("breadcrumbs expose visible and machine-readable canonical hierarchies", async () => {
  for (const path of indexablePaths.filter((candidate) => candidate !== "/en/")) {
    const html = await expectPage(path, [/aria-label="Breadcrumb"/, /"@type":"BreadcrumbList"/]);
    const breadcrumbs = jsonLdRecords(html).find((record) => record["@type"] === "BreadcrumbList");
    assert.ok(breadcrumbs, `${path} should have BreadcrumbList data`);
    assert.ok(breadcrumbs.itemListElement.length >= 2, `${path} should have a useful hierarchy`);
    assert.equal(breadcrumbs.itemListElement.at(-1).item, `${expectedOrigin}${path}`);
    breadcrumbs.itemListElement.forEach((item, index) => {
      assert.equal(item.position, index + 1);
      assert.ok(item.item.startsWith(`${expectedOrigin}/en/`));
    });
  }
});

test("structured data stays tied to canonical pages and cited primary sources", async () => {
  const category = await expectPage("/en/dishwashers/", [/"@type":"CollectionPage"/, /"inLanguage":"en"/]);
  assert.ok(category.includes(`"url":"${expectedOrigin}/en/dishwashers/"`));

  for (const path of [...problemPaths, ...errorCodePaths]) {
    const html = await expectPage(path, [
      /"@type":"TechArticle"/,
      /"inLanguage":"en"/,
      /"author":\{"@type":"Organization","name":"FixLookup"/,
      /"publisher":\{"@type":"Organization","name":"FixLookup"/,
      /"dateModified":"2026-08-17"/,
      /"isBasedOn":\["https:\/\//,
    ]);
    assert.ok(html.includes(`"url":"${expectedOrigin}${path}"`));
    assert.ok(html.includes(`"mainEntityOfPage":"${expectedOrigin}${path}"`));
  }


  for (const path of modelPaths) {
    const html = await expectPage(path, [
      /"@type":"WebPage"/,
      /"mainEntity":\{"@type":"Product"/,
      /"brand":\{"@type":"Brand"/,
      /"isBasedOn":\["https:\/\//,
    ]);
    assert.ok(html.includes(`"url":"${expectedOrigin}${path}"`));
  }
});

test("sitemap contains exactly the real indexable English URLs", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const sitemap = await response.text();
  for (const path of indexablePaths) {
    assert.ok(sitemap.includes(`<loc>${expectedOrigin}${path}</loc>`));
  }
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(locations.length, indexablePaths.length);
  assert.equal(new Set(locations).size, locations.length, "sitemap URLs must be unique");
  assert.match(sitemap, /hreflang="en"/);
  assert.match(sitemap, /hreflang="x-default"/);
  assert.doesNotMatch(sitemap, /hreflang="(?:fi|de|es|fr)"|\/troubleshooter\/|\/error-codes\//);
  for (const path of modelPaths) assert.ok(sitemap.includes(`<loc>${expectedOrigin}${path}</loc>`));
  assert.doesNotMatch(sitemap, /demo|needs-review|fictional/i);
  assert.equal((sitemap.match(/<lastmod>2026-08-17<\/lastmod>/g) ?? []).length, indexablePaths.length);
  locations.forEach((location) => assert.ok(location.startsWith(`${expectedOrigin}/en/`)));
});

test("manifest and generated application icons use production brand metadata", async () => {
  const response = await render("/manifest.webmanifest");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /application\/manifest\+json/);
  const manifest = await response.json();
  assert.equal(manifest.name, "FixLookup");
  assert.equal(manifest.short_name, "FixLookup");
  assert.equal(manifest.start_url, "/en/");
  assert.deepEqual(manifest.icons.map((icon) => icon.src), ["/icon", "/apple-icon"]);

  for (const path of ["/icon", "/apple-icon"]) {
    const icon = await render(path);
    assert.equal(icon.status, 200, `${path} should be generated`);
    assert.match(icon.headers.get("content-type") ?? "", /^image\/png/);
  }
});

test("legacy and unknown records return real 404s without competing metadata", async () => {
  for (const path of [
    "/dishwashers/bosch/error-codes/e15/",
    "/en/dishwashers/bosch/error-codes/e15/",
    "/en/dishwashers/bosch/models/example-dw-100/",
    "/en/dishwashers/whirlpool/models/wdf550safw/",
    "/en/dishwashers/samsung/models/dw60a6090bb/",
    "/en/dishwashers/samsung/models/dw60a6090bb-ef/4c/",
    "/en/dishwashers/problems/demo-not-starting/",
    "/en/dishwashers/bosch/demo-01/",
    "/en/dishwashers/bosch/e17/",
    "/en/dishwashers/siemens/e25/",
    "/en/dishwashers/electrolux/al6/",
    "/en/dishwashers/samsung/5e/",
    "/en/dishwashers/whirlpool/f8-e4/",
    "/en/dishwashers/lg/ei/",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 404, `${path} should not resolve`);
    const html = await response.text();
    assert.doesNotMatch(html, /rel="canonical"|property="og:url"/);
  }
});

test("all discoverable locale-prefixed internal links resolve", async () => {
  const pending = ["/en/"];
  const visited = new Set();
  while (pending.length) {
    const path = pending.shift();
    if (!path || visited.has(path)) continue;
    visited.add(path);
    const response = await render(path);
    assert.ok(response.status < 400, `${path} returned ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("text/html")) continue;
    const html = await response.text();
    const hrefs = [...html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g)]
      .map((match) => match[1])
      .filter((href) => !href.startsWith("/_next"));
    for (const href of hrefs) {
      assert.ok(href.startsWith("/en/"), `internal link leaves locale: ${href}`);
      if (!visited.has(href) && !pending.includes(href)) pending.push(href);
    }
  }
  assert.ok(visited.size >= 30, `expected the full linked cluster, saw ${visited.size}`);
});
