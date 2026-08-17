import { spawnSync } from "node:child_process";

const environment = {
  ...process.env,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: "G-TESTPREVIEW1",
  VERCEL_ENV: "preview",
};
const npmCli = process.env.npm_execpath;
if (!npmCli) {
  process.stderr.write("npm_execpath is unavailable; run this check through npm.\n");
  process.exit(1);
}

for (const [command, args] of [
  [process.execPath, [npmCli, "run", "build:sites"]],
  [process.execPath, ["--test", "tests/preview-rendered.preview.mjs"]],
]) {
  const result = spawnSync(command, args, { env: environment, stdio: "inherit" });
  if (result.error) process.stderr.write(`${result.error.message}\n`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
