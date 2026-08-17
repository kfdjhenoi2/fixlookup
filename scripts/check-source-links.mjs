import { readFile } from "node:fs/promises";

const sourceFile = new URL("../lib/data/dishwashers/sources.ts", import.meta.url);
const sourceText = await readFile(sourceFile, "utf8");
const records = [...sourceText.matchAll(/source\(\s*"([^"]+)"\s*,\s*"[^"]+"\s*,\s*"(https:\/\/[^"\s]+)"/g)]
  .map(([, id, url]) => ({ id, url }));

if (!records.length) throw new Error("No dishwasher source URLs were found");

const failures = [];
const inconclusive = [];
let nextIndex = 0;

async function worker() {
  while (nextIndex < records.length) {
    const record = records[nextIndex];
    nextIndex += 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    try {
      const response = await fetch(record.url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          accept: "text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8",
          "user-agent": "FixLookup source-review link checker/1.0 (+https://fixlookup.com)",
        },
      });
      const sourcePath = new URL(record.url).pathname.replace(/\/$/, "");
      const finalPath = new URL(response.url).pathname.replace(/\/$/, "");
      if (sourcePath !== finalPath && /\/support\/help-library$/i.test(finalPath)) {
        failures.push({ ...record, status: response.status, finalUrl: response.url, error: "redirected to a generic help-library page" });
      } else if ([401, 403, 429, 503].includes(response.status)) {
        inconclusive.push({ ...record, status: response.status, finalUrl: response.url });
      } else if (response.status < 200 || response.status >= 400) {
        failures.push({ ...record, status: response.status, finalUrl: response.url });
      }
      await response.body?.cancel();
    } catch (error) {
      inconclusive.push({ ...record, error: error instanceof Error ? error.message : String(error) });
    } finally {
      clearTimeout(timeout);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(8, records.length) }, () => worker()));

console.log(JSON.stringify({
  checked: records.length,
  passed: records.length - failures.length - inconclusive.length,
  inconclusive,
  failures,
}, null, 2));

if (failures.length) {
  process.exitCode = 1;
}
