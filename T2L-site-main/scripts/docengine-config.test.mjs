import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourceRoot = resolve(here, "..");

const read = (relativePath) => readFile(resolve(sourceRoot, relativePath), "utf8");

const [standalone, origin, engineProxy, nextConfig, catchAllProxy, docEngineProxy, filesProxy] =
  await Promise.all([
    read("app/components/DocEngineStandalone/DocEngineStandaloneApp.tsx"),
    read("lib/docengine-origin.ts"),
    read("lib/engine-proxy.ts"),
    read("next.config.ts"),
    read("app/api/[...path]/route.ts"),
    read("app/api/docengine/[...path]/route.ts"),
    read("app/files/[...path]/route.ts"),
  ]);

// The serialized legacy wizard must be rewritten to same-origin routing before
// it is mounted; this is the production regression that previously sent the
// browser directly to Railway and failed CORS with "Failed to fetch".
assert.match(standalone, /source\.replace\(\s*\/const API = \[\^;\]\+;\//s);
assert.match(
  standalone,
  /const API = \(window\.location\.protocol === 'file:'\) \? 'http:\/\/127\.0\.0\.1:8000' : '';/,
);
assert.doesNotMatch(standalone, /turn2law-webiste-production\.up\.railway\.app/);

// Backend origin resolution lives in exactly one module. Production has one
// authoritative fallback and the local engine is development-only.
assert.match(origin, /process\.env\.NODE_ENV === "production"/);
assert.match(origin, /https:\/\/turn2law-webiste-1\.onrender\.com/);
assert.doesNotMatch(origin, /railway\.app/);

// No other file may re-derive the origin — that duplication is what let
// production drift onto a stale backend URL.
for (const [name, source] of [
  ["next.config.ts", nextConfig],
  ["app/api/[...path]/route.ts", catchAllProxy],
  ["app/api/docengine/[...path]/route.ts", docEngineProxy],
  ["lib/engine-proxy.ts", engineProxy],
  ["app/files/[...path]/route.ts", filesProxy],
]) {
  assert.doesNotMatch(
    source,
    /onrender\.com|railway\.app/,
    `${name} must import the engine origin instead of hardcoding it`,
  );
}

// The engine origin must be resolved at request time for BOTH the API and the
// PDF path. A rewrites() destination is baked into the build, so configuring
// /files/* there let documents be served from a different backend than the one
// that generated them.
assert.doesNotMatch(
  nextConfig,
  /^\s*(async\s+)?rewrites\s*\(/m,
  "next.config.ts must not route engine traffic through build-time rewrites",
);
assert.match(filesProxy, /proxyToEngine\(request, path, "files"\)/);
assert.match(engineProxy, /from "\.\/docengine-origin"/);

// Both proxy entry points delegate to the same implementation and allow enough
// time for a two-pass XeLaTeX compile on a cold backend.
for (const [name, source] of [
  ["app/api/[...path]/route.ts", catchAllProxy],
  ["app/api/docengine/[...path]/route.ts", docEngineProxy],
]) {
  assert.match(source, /proxyToEngine/, `${name} must delegate to the shared proxy`);
  assert.match(source, /export const maxDuration = 120;/, `${name} needs a compile-sized budget`);
}

// A hung or unreachable engine must still produce the JSON envelope the wizard
// parses, never an opaque HTML error page.
assert.match(engineProxy, /AbortSignal\.timeout/);
assert.match(engineProxy, /success: false/);

console.log("Document Engine configuration regression tests passed.");
