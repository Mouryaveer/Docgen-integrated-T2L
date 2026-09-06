import { NextRequest } from "next/server";
import { engineCorsPreflight, proxyToEngine } from "@/lib/engine-proxy";

// Document generation runs two XeLaTeX passes (~5s warm, longer on a cold
// Render instance). Without an explicit budget the platform default can abort
// the function while the PDF is still compiling.
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
