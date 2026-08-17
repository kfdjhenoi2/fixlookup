import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const repository = process.cwd().replaceAll("\\", "/");
const tracked = spawnSync(
  "git",
  ["-c", `safe.directory=${repository}`, "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
);
if (tracked.status !== 0) {
  process.stderr.write("Unable to list repository files for secret scanning.\n");
  process.exit(1);
}

const patterns = [
  new RegExp(["BEGIN ", "PRIVATE KEY"].join(""), "i"),
  new RegExp(["BEGIN ", "RSA ", "PRIVATE KEY"].join(""), "i"),
  new RegExp(["BEGIN ", "EC ", "PRIVATE KEY"].join(""), "i"),
  new RegExp(["BEGIN ", "OPENSSH ", "PRIVATE KEY"].join(""), "i"),
  new RegExp(["A", "K", "I", "A", "[0-9A-Z]{16}"].join("")),
  new RegExp(["s", "k", "-", "[A-Za-z0-9_-]{20,}"].join("")),
];
const ignored = new Set(["package-lock.json", "public/og.png"]);
const findings = [];

for (const file of tracked.stdout.split("\0").filter(Boolean)) {
  if (ignored.has(file)) continue;
  let value;
  try {
    value = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (patterns.some((pattern) => pattern.test(value))) findings.push(file);
}

if (findings.length) {
  process.stderr.write(`Potential credential material found in: ${findings.join(", ")}\n`);
  process.exit(1);
}

process.stdout.write("No credential-shaped material found in repository files.\n");
