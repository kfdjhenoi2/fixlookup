import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("preview-test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function render(path) {
  return worker.fetch(
    new Request(new URL(path, "http://preview.local"), { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("preview build blocks crawling at the response and document layers", async () => {
  const robotsResponse = await render("/robots.txt");
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /^Disallow:\s*\/$/im);
  assert.doesNotMatch(robots, /^Sitemap:/im);

  const response = await render("/en/");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  const html = await response.text();
  assert.match(html, /name="robots" content="noindex, nofollow, nocache"/);
  assert.match(html, /rel="canonical" href="https:\/\/fixlookup\.com\/en\/"/);
  assert.doesNotMatch(html, /rel="canonical" href="http:\/\/preview\.local|property="og:url" content="http:\/\/preview\.local/);
});
