/**
 * The Doc Engine wizard ships as a serialized JS bundle inside a TSX string
 * constant, which is injected into <script> elements at mount time after a
 * regex rewrite (const/let -> var, API base substitution).
 *
 * TypeScript cannot see inside that string, so a typo there compiles cleanly
 * and only fails in the browser. This test reproduces the exact runtime
 * transform and parses every chunk.
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const componentPath = resolve(
  here,
  "../app/components/DocEngineStandalone/DocEngineStandaloneApp.tsx",
);

const source = await readFile(componentPath, "utf8");

function extractArray(name) {
  const match = source.match(
    new RegExp(`const ${name}(?:: string\\[\\])? = (\\[[\\s\\S]*?\\]);\\r?\\n`),
  );
  assert.ok(match, `could not locate ${name} in DocEngineStandaloneApp.tsx`);
  return eval(match[1]);
}

const scripts = extractArray("SCRIPTS");
assert.ok(scripts.length > 0, "SCRIPTS must not be empty");

// Mirror the transform performed in the component's useEffect.
function toRuntimeSource(chunk) {
  return chunk
    .replace(
      /const API = [^;]+;/,
      "const API = (window.location.protocol === 'file:') ? 'http://127.0.0.1:8000' : '';",
    )
    .replace(/^\s*'use strict';\s*/m, "")
    .replace(/\bconst\b/g, "var")
    .replace(/\blet\b/g, "var");
}

scripts.forEach((chunk, index) => {
  const runtime = toRuntimeSource(chunk);
  assert.doesNotThrow(
    () => new vm.Script(runtime, { filename: `docengine-chunk-${index}.js` }),
    `chunk ${index} is not valid JavaScript after the const/let -> var rewrite`,
  );
});

const bundle = scripts.join("\n");

// The API base rewrite must still have exactly one declaration to target.
const apiDeclarations = bundle.match(/const API = [^;]+;/g) || [];
assert.equal(
  apiDeclarations.length,
  1,
  "expected exactly one `const API = ...;` declaration for the mount-time rewrite",
);

// Every engine call must carry a timeout, otherwise a stalled backend leaves
// the wizard spinning with no recovery path.
assert.match(bundle, /function apiFetch\(/, "apiFetch wrapper must exist");
assert.equal(
  (bundle.match(/(?<!api)fetch\(`\$\{API\}/g) || []).length,
  0,
  "all engine calls must go through apiFetch, not bare fetch",
);
assert.match(bundle, /AbortController/, "apiFetch must be abortable");

// Global listeners must be registered for teardown or they leak on every mount.
assert.ok(
  (bundle.match(/__T2L_DOCENGINE_TEARDOWN__\.push/g) || []).length >= 2,
  "window/document listeners must register a teardown callback",
);
const globalListeners = (
  bundle.match(/(?:window|document)\.addEventListener\(/g) || []
).length;
const teardowns = (bundle.match(/__T2L_DOCENGINE_TEARDOWN__\.push/g) || []).length;
assert.equal(
  globalListeners,
  teardowns,
  `every global listener needs a teardown (${globalListeners} listeners, ${teardowns} teardowns)`,
);

// The fake progress delays that used to add ~2.5s to every generation must not
// creep back in.
assert.doesNotMatch(
  bundle,
  /GEN_STEPS_TIMES/,
  "the blocking pre-flight animation budget must stay removed",
);
assert.match(bundle, /const requestPromise = callGenerateAPI\(\);/);

console.log(
  `Document Engine bundle tests passed (${scripts.length} chunks parsed, ${teardowns} teardowns).`,
);
