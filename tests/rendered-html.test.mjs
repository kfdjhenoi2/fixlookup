import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

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

test("server-renders the finished homepage", async () => {
  const html = await expectPage("/", [
    /<title>FixOrReplace/,
    /Find the right next step/,
    /Search by device, manufacturer, model, symptom, or error code/,
    /Evidence before answers/,
  ]);

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
  assert.match(html, /application\/ld\+json/);
});

test("renders the main category and manufacturer templates", async () => {
  await expectPage("/dishwashers", [
    /Dishwasher troubleshooting/,
    /Choose the name on your appliance/,
    /Bosch/,
    /Samsung/,
  ]);
  await expectPage("/dishwashers/bosch", [
    /Bosch(?:<!-- -->)? dishwashers/,
    /Example Dishwasher 100/,
    /Error codes/,
  ]);
  await expectPage("/dishwashers/siemens", [
    /Siemens(?:<!-- -->)? dishwashers/,
    /No verified models published yet/,
  ]);
});

test("renders model, problem, error-code, and troubleshooter templates", async () => {
  await expectPage("/dishwashers/bosch/models/example-dw-100", [
    /Fictional model/,
    /EXAMPLE-DW-100/,
    /Linked troubleshooting guide/,
    /Sources &amp; references/,
  ]);
  await expectPage("/dishwashers/problems/demo-not-starting", [
    /Problem record/,
    /Sources &amp; references/,
    /Related problems/,
  ]);
  const errorCode = await expectPage("/dishwashers/bosch/error-codes/demo-01", [
    /DEMO-01/,
    /This code has no real appliance meaning/,
    /Continue on the problem guide/,
    /href="\/dishwashers\/problems\/demo-not-starting"/,
  ]);
  assert.doesNotMatch(errorCode, /Write down the exact model identifier/);
  await expectPage("/dishwashers/troubleshooter", [
    /Interactive framework/,
    /Is there an immediate safety concern/,
  ]);
});

test("serves technical SEO foundations", async () => {
  const manufacturer = await expectPage("/dishwashers/bosch", [
    /<title>Bosch dishwasher troubleshooting \| FixOrReplace<\/title>/,
    /property="og:title" content="Bosch dishwasher troubleshooting \| FixOrReplace"/,
    /rel="canonical" href="http:\/\/localhost:3000\/dishwashers\/bosch"/,
  ]);
  assert.match(manufacturer, /name="robots" content="noindex, follow"/);

  const demoRoutes = [
    "/dishwashers/bosch/error-codes/demo-01",
    "/dishwashers/bosch/models/example-dw-100",
    "/dishwashers/problems/demo-not-starting",
    "/dishwashers/troubleshooter",
  ];
  const demoPages = await Promise.all(
    demoRoutes.map((route) =>
      expectPage(route, [/name="robots" content="noindex, follow"/]),
    ),
  );
  const [demoRecord] = demoPages;
  assert.match(demoRecord, /property="og:image" content="http:\/\/localhost:3000\/og.png"/);

  const sitemapResponse = await render("/sitemap.xml");
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<urlset/);
  assert.match(sitemap, /<loc>http:\/\/localhost:3000\/dishwashers<\/loc>/);
  assert.doesNotMatch(
    sitemap,
    /\/dishwashers\/(bosch|siemens|electrolux|whirlpool|samsung|troubleshooter)|demo-01|example-dw-100|demo-not-starting/,
  );

  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Sitemap:/i);
});

test("unknown content records return a real not-found response", async () => {
  const response = await render("/dishwashers/bosch/models/not-a-real-model");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /That troubleshooting record is not here/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(html, /rel="canonical"/);
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

  assert.ok(visited.size >= 12, `expected a useful route crawl, saw ${visited.size}`);
});
