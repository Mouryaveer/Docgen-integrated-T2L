import { NextRequest } from "next/server";
import { engineCorsPreflight, proxyToEngine } from "@/lib/engine-proxy";

// Kept in step with app/api/[...path]/route.ts — both delegate to the same
// shared proxy so the two entry points cannot drift apart.
export const maxDuration = 120;
export const dynamic = "force-dynamic";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyToEngine(request, path);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

export function OPTIONS() {
  return engineCorsPreflight();
}
