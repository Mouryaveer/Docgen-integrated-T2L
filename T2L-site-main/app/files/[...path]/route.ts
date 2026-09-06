import { NextRequest } from "next/server";
import { proxyToEngine } from "@/lib/engine-proxy";

/**
 * Generated PDF passthrough.
 *
 * This used to be a `rewrites()` entry in next.config.ts, which bakes the
 * engine origin in at BUILD time — while /api/* resolved it at request time.
 * A deployment could therefore serve documents from one backend and generate
 * them on another, and repointing the engine required a full rebuild.
 * Routing it here keeps a single runtime-resolved origin for both paths.
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToEngine(request, path, "files");
}

export const GET = handler;
export const HEAD = handler;
