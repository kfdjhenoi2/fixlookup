import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const problemPaths = [
  "/dishwashers/problems/dishwasher-not-draining",
  "/dishwashers/problems/dishwasher-not-filling-with-water",
  "/dishwashers/problems/dishwasher-leaking",
  "/dishwashers/problems/dishwasher-will-not-start",
  "/dishwashers/problems/dishwasher-not-cleaning",
  "/dishwashers/problems/dishwasher-not-drying",
  "/dishwashers/problems/white-residue-on-dishes",
  "/dishwashers/problems/dishwasher-tablet-not-dissolving",
];

const errorCodePaths = [
  "/dishwashers/bosch/error-codes/e15",
  "/dishwashers/bosch/error-codes/e24",
  "/dishwashers/siemens/error-codes/e15",
  "/dishwashers/electrolux/error-codes/i20",
  "/dishwashers/electrolux/error-codes/i30",
  "/dishwashers/samsung/error-codes/4c-4e",
  "/dishwashers/samsung/error-codes/5c-5e",
  "/dishwashers/samsung/error-codes/lc-le",
  "/dishwashers/whirlpool/error-codes/f8e4",
];

function render(path = "/") {
  return worker.fetch(
    new Request(new URL(path, "http://localhost"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
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

test("server-renders the source-reviewed homepage", async () => {
  const html = await expectPage("/", [
    /<title>FixOrReplace/,
    /Find the right next step/,
    /Search by device, manufacturer, model, symptom, or error code/,
    /Source-reviewed guidance/,
    /Bosch E15/,
  ]);

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /DEMO-01|Example Dishwasher 100|demo symptom/i);
});

test("renders the category and manufacturer indexes", async () => {
  const category = await expectPage("/dishwashers", [
    /Dishwasher troubleshooting/,
    /Choose the name on your appliance/,
    /8(?:<!-- -->)? reviewed topics/,
    /Dishwasher not draining or leaving standing water/,
  ]);
  assert.ok((category.match(/Source verified/g) ?? []).length >= 8);

  await expectPage("/dishwashers/bosch", [
    /Bosch(?:<!-- -->)? dishwashers/,
    /No verified models published yet/,
    /E15/,
    /E24/,
  ]);
  await expectPage("/dishwashers/electrolux", [
    /Electrolux(?:<!-- -->)? dishwashers/,
    /i20/,
    /C2/,
    /i30/,
  ]);
  await expectPage("/dishwashers/samsung", [/4C \/ 4E/, /5C \/ 5E/, /LC \/ LE/]);
});

test("renders shared guides with claim-level source links", async () => {
  const drainage = await expectPage(problemPaths[0], [
    /Problem record/,
    /Safe dishwasher drainage checks/,
    /Sources &amp; references/,
    /Related problems/,
    /Accessed[\s\S]{0,80}2026-08-17/,
  ]);
  assert.match(drainage, /href="#source-source-bosch-not-draining"/);
  assert.match(drainage, /id="source-source-bosch-not-draining"/);
  assert.match(drainage, /Clean only the removable filter described in the manual/);
  assert.match(drainage, /"@type":"TechArticle"/);

  for (const path of problemPaths) {
    const html = await expectPage(path, [
      /Source verified/,
      /Sources &amp; references/,
      /class="claim-sources"/,
    ]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
});

test("renders canonical manufacturer code records without duplicate workflows", async () => {
  const boschE15 = await expectPage(errorCodePaths[0], [
    /Bosch(?:<!-- -->)? E15 error code/,
    /safety switch detected water/,
    /Model compatibility is not inferred/,
    /Bosch US dishwasher support/,
    /href="\/dishwashers\/problems\/dishwasher-leaking"/,
  ]);
  assert.doesNotMatch(boschE15, /Limit checks to accessible areas/);
  assert.match(boschE15, /"@type":"TechArticle"/);

  await expectPage("/dishwashers/electrolux/error-codes/i20", [
    /i20 drainage error/,
    /C2, F2, AL6, 2 beeps, 2 LED flashes/,
    /href="\/dishwashers\/problems\/dishwasher-not-draining"/,
  ]);
  await expectPage("/dishwashers/samsung/error-codes/4c-4e", [
    /4C \/ 4E information code/,
    /water-supply issue codes/,
    /Assigned model families/,
  ]);

  for (const path of errorCodePaths) {
    const html = await expectPage(path, [
      /Source verified/,
      /Model compatibility is not inferred/,
      /Sources &amp; references/,
      /Meaning source/,
    ]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
});

test("publishes unique metadata and canonical URLs for the complete cluster", async () => {
  const routes = [
    ...problemPaths,
    ...errorCodePaths,
    "/dishwashers/bosch",
    "/dishwashers/siemens",
    "/dishwashers/electrolux",
    "/dishwashers/whirlpool",
    "/dishwashers/samsung",
  ];
  const titles = new Set();
  const descriptions = new Set();

  for (const path of routes) {
    const html = await expectPage(path, [
      new RegExp(`rel="canonical" href="http:\\/\\/localhost:3000${path.replaceAll("/", "\\/")}"`),
      /property="og:title"/,
      /property="og:description"/,
    ]);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
    assert.ok(title, `${path} should have a title`);
    assert.ok(description, `${path} should have a description`);
    assert.ok(!titles.has(title), `${path} has duplicate title ${title}`);
    assert.ok(!descriptions.has(description), `${path} has duplicate description`);
    titles.add(title);
    descriptions.add(description);
  }

  const troubleshooter = await expectPage("/dishwashers/troubleshooter", [
    /Interactive framework/,
    /name="robots" content="noindex, follow"/,
  ]);
  assert.match(troubleshooter, /No model compatibility is assumed/);
});

test("sitemap includes reviewed pages and excludes thin or unsupported routes", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<urlset/);
  for (const path of [...problemPaths, ...errorCodePaths]) {
    assert.match(sitemap, new RegExp(`<loc>http:\\/\\/localhost:3000${path.replaceAll("/", "\\/")}<\\/loc>`));
  }
  assert.doesNotMatch(sitemap, /\/dishwashers\/troubleshooter|\/models\//);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 25);

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Sitemap:/i);
});

test("removed demo records and unknown content return a real not-found response", async () => {
  for (const path of [
    "/dishwashers/bosch/models/example-dw-100",
    "/dishwashers/problems/demo-not-starting",
    "/dishwashers/bosch/error-codes/demo-01",
    "/dishwashers/bosch/models/not-a-real-model",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 404, `${path} should not resolve`);
    const html = await response.text();
    assert.match(html, /That troubleshooting record is not here/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(html, /rel="canonical"/);
  }
});

test("all discoverable internal page links resolve", async () => {
  const pending = ["/"];
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
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)]
      .map((match) => match[1])
      .filter((href) => !href.startsWith("/_next"));

    for (const href of hrefs) {
      if (!visited.has(href) && !pending.includes(href)) pending.push(href);
    }
  }

  assert.ok(visited.size >= 26, `expected the full linked cluster, saw ${visited.size}`);
});
