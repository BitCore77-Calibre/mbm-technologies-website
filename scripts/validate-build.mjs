// Checks that the build produced a Cloudflare Worker with a fetch handler.
import { access } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const workerPath = resolve("dist/server/index.js");
await access(workerPath).catch(() => {
  console.error("Missing build output: dist/server/index.js");
  process.exit(66);
});

const url = pathToFileURL(workerPath);
url.searchParams.set("validate", String(Date.now()));
const worker = await import(url.href);
if (!worker.default || typeof worker.default.fetch !== "function") {
  console.error("dist/server/index.js must export default { fetch(request, env, ctx) }");
  process.exit(1);
}
console.log("Build OK: Cloudflare Worker with fetch handler found in dist/server/index.js");
