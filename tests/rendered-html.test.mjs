import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const problemPaths = [
  "/en/dishwashers/problems/dishwasher-not-draining/",
  "/en/dishwashers/problems/dishwasher-not-filling-with-water/",
  "/en/dishwashers/problems/dishwasher-leaking/",
  "/en/dishwashers/problems/dishwasher-will-not-start/",
  "/en/dishwashers/problems/dishwasher-not-cleaning/",
  "/en/dishwashers/problems/dishwasher-not-drying/",
  "/en/dishwashers/problems/white-residue-on-dishes/",
  "/en/dishwashers/problems/dishwasher-tablet-not-dissolving/",
];

const errorCodePaths = [
  "/en/dishwashers/bosch/e15/",
  "/en/dishwashers/bosch/e24/",
  "/en/dishwashers/siemens/e15/",
  "/en/dishwashers/electrolux/i20/",
  "/en/dishwashers/electrolux/i30/",
  "/en/dishwashers/samsung/4c-4e/",
  "/en/dishwashers/samsung/5c-5e/",
  "/en/dishwashers/samsung/lc-le/",
  "/en/dishwashers/whirlpool/f8e4/",
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

test("root redirects to the default locale and only supported locales resolve", async () => {
  const root = await render("/");
  assert.equal(root.status, 308);
  assert.equal(root.headers.get("location"), "/en/");

  const home = await expectPage("/en/", [
    /<html lang="en">/,
    /Find the right next step/,
    /Search by device, manufacturer, model, symptom, or error code/,
    /href="\/en\/dishwashers\/bosch\/e15\/"/,
  ]);
  assert.doesNotMatch(home, /href="\/(?:devices|dishwashers)(?:\/|")/);

  for (const path of ["/fi/", "/de/", "/zz/", "/dishwashers/"]) {
    const response = await render(path);
    assert.equal(response.status, 404, `${path} must not be published`);
  }
});

test("renders locale-aware category, manufacturer, and search links", async () => {
  const category = await expectPage("/en/dishwashers/", [
    /Dishwasher troubleshooting/,
    /Choose the name on your appliance/,
    /8(?:<!-- -->)? reviewed topics/,
    /href="\/en\/dishwashers\/bosch\/"/,
    /href="\/en\/dishwashers\/problems\/dishwasher-not-draining\/"/,
  ]);
  assert.ok((category.match(/Source verified/g) ?? []).length >= 8);

  await expectPage("/en/dishwashers/bosch/", [/Bosch(?:<!-- -->)? dishwashers/, /No verified models published yet/, /E15/, /E24/]);
  await expectPage("/en/dishwashers/electrolux/", [/Electrolux(?:<!-- -->)? dishwashers/, /i20/, /C2/, /i30/]);
  await expectPage("/en/dishwashers/samsung/", [/4C \/ 4E/, /5C \/ 5E/, /LC \/ LE/]);
});

test("renders shared guides with claim-level source links", async () => {
  const drainage = await expectPage(problemPaths[0], [
    /Shared problem guide/,
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
    const html = await expectPage(path, [/Source verified/, /Sources &amp; references/, /class="claim-sources"/]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
});

test("manufacturer code pages reuse canonical guides rather than duplicate steps", async () => {
  const boschE15 = await expectPage(errorCodePaths[0], [
    /Bosch(?:<!-- -->)? E15/,
    /safety switch detected water/,
    /No model family is assigned/,
    /Bosch US dishwasher support/,
    /href="\/en\/dishwashers\/problems\/dishwasher-leaking\/"/,
  ]);
  assert.doesNotMatch(boschE15, /Limit checks to accessible areas/);
  assert.match(boschE15, /"@type":"TechArticle"/);

  await expectPage("/en/dishwashers/electrolux/i20/", [/i20 drainage error/, /C2, F2, AL6, 2 beeps, 2 LED flashes/, /dishwasher-not-draining/]);
  await expectPage("/en/dishwashers/samsung/4c-4e/", [/4C \/ 4E information code/, /water-supply issue codes/]);
  for (const path of errorCodePaths) {
    const html = await expectPage(path, [/Source verified/, /Applicability boundary/, /Sources &amp; references/, /Source scope/]);
    assert.doesNotMatch(html, /name="robots" content="noindex/);
  }
});

test("metadata uses locale-prefixed canonicals and only real language alternates", async () => {
  const routes = ["/en/", "/en/devices/", "/en/dishwashers/", ...problemPaths, ...errorCodePaths];
  const titles = new Set();
  const descriptions = new Set();
  for (const path of routes) {
    const html = await expectPage(path, [
      new RegExp(`rel="canonical" href="http:\\/\\/localhost:3000${path.replaceAll("/", "\\/")}"`),
      /hreflang="en"/,
      /hreflang="x-default"/,
      /property="og:title"/,
      /property="og:description"/,
    ]);
    assert.doesNotMatch(html, /hreflang="(?:fi|de|es|fr)"/);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
    assert.ok(title, `${path} should have a title`);
    assert.ok(description, `${path} should have a description`);
    assert.ok(!titles.has(title), `${path} has duplicate title ${title}`);
    assert.ok(!descriptions.has(description), `${path} has duplicate description`);
    titles.add(title);
    descriptions.add(description);
  }

  const troubleshooter = await expectPage("/en/dishwashers/troubleshooter/", [/Interactive framework/, /name="robots" content="noindex, follow"/]);
  assert.match(troubleshooter, /No model compatibility is assumed/);
});

test("sitemap contains only indexed English routes and valid alternates", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const sitemap = await response.text();
  for (const path of [...problemPaths, ...errorCodePaths]) {
    assert.match(sitemap, new RegExp(`<loc>http:\\/\\/localhost:3000${path.replaceAll("/", "\\/")}<\\/loc>`));
  }
  assert.equal((sitemap.match(/<url>/g) ?? []).length, 25);
  assert.match(sitemap, /hreflang="en"/);
  assert.match(sitemap, /hreflang="x-default"/);
  assert.doesNotMatch(sitemap, /hreflang="(?:fi|de|es|fr)"|\/dishwashers\/[^<]*error-codes|\/models\//);
  assert.doesNotMatch(sitemap, /<loc>http:\/\/localhost:3000\/(?!en\/)/);
});

test("legacy and unknown records do not compete with localized pages", async () => {
  for (const path of [
    "/dishwashers/bosch/error-codes/e15/",
    "/en/dishwashers/bosch/error-codes/e15/",
    "/en/dishwashers/bosch/models/example-dw-100/",
    "/en/dishwashers/problems/demo-not-starting/",
    "/en/dishwashers/bosch/demo-01/",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 404, `${path} should not resolve`);
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
    const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)]
      .map((match) => match[1])
      .filter((href) => !href.startsWith("/_next"));
    for (const href of hrefs) {
      assert.ok(href.startsWith("/en/"), `internal link leaves locale: ${href}`);
      if (!visited.has(href) && !pending.includes(href)) pending.push(href);
    }
  }
  assert.ok(visited.size >= 26, `expected the full linked cluster, saw ${visited.size}`);
});
