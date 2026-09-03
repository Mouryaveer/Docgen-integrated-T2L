import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(here, "..");

const [standalone, nextConfig, catchAllProxy, docEngineProxy] = await Promise.all([
  readFile(resolve(sourceRoot, "app/components/DocEngineStandalone/DocEngineStandaloneApp.tsx"), "utf8"),
  readFile(resolve(sourceRoot, "next.config.ts"), "utf8"),
  readFile(resolve(sourceRoot, "app/api/[...path]/route.ts"), "utf8"),
  readFile(resolve(sourceRoot, "app/api/docengine/[...path]/route.ts"), "utf8"),
]);

// The serialized legacy wizard must be rewritten to same-origin routing before
// it is mounted; this is the production regression that previously sent the
// browser directly to Railway and failed CORS with "Failed to fetch".
assert.match(standalone, /source\.replace\(\s*\/const API = \[\^;\]\+;\//s);
assert.match(standalone, /const API = \(window\.location\.protocol === 'file:'\) \? 'http:\/\/127\.0\.0\.1:8000' : '';/);
assert.doesNotMatch(standalone, /turn2law-webiste-production\.up\.railway\.app/);

// Production has one authoritative backend fallback. Local development keeps
// the local engine fallback without making it a production deployment target.
for (const source of [nextConfig, catchAllProxy, docEngineProxy]) {
  assert.match(source, /process\.env\.NODE_ENV === "production"/);
  assert.match(source, /https:\/\/turn2law-webiste-1\.onrender\.com/);
}
assert.doesNotMatch(nextConfig, /railway\.app/);

console.log("Document Engine configuration regression tests passed.");
