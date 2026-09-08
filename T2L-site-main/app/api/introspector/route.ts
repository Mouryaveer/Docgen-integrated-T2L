import { NextRequest, NextResponse } from "next/server";
import { INTROSPECTOR_URL } from "@/lib/introspector-origin";

/**
 * Same-origin reverse proxy for the Introspector RAG backend.
 *
 * The browser talks to `/api/introspector` (same origin as the site), so there
 * is no CORS friction and the real backend URL never reaches the client. This
 * forwards to the FastAPI service's `POST /api/query` endpoint, which expects
 * `{ "query": string }` and returns `{ response, model_used }`.
 *
 * Pattern intentionally mirrors lib/engine-proxy.ts.
 */

// A cold Render free-tier instance can take 30–60s to wake, and the RAG chain
// itself (retrieval + generation, with retries) is not instant. Give the
// upstream a generous budget so the request isn't aborted mid-generation.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const UPSTREAM_TIMEOUT_MS = 55_000;

export async function POST(request: NextRequest): Promise<NextResponse> {
  let query: unknown;
  try {
    const body = await request.json();
    query = body?.query;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body. Expected JSON with a 'query' field." },
      { status: 400 },
    );
  }

  if (typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json(
      { error: "The 'query' field is required and must be a non-empty string." },
      { status: 400 },
    );
  }

  const upstreamUrl = `${INTROSPECTOR_URL}/api/query`;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    // Pass the upstream JSON through untouched when possible so the client sees
    // { response, model_used } on success or the backend's own error detail.
    const text = await upstream.text();
    let payload: unknown;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: "The Introspector backend returned an unreadable response." };
    }

    return NextResponse.json(payload, { status: upstream.status });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        error: timedOut
          ? "Introspector took too long to respond. Please try again."
          : "Cannot reach the Introspector backend. The service may be unavailable or still waking up.",
      },
      { status: timedOut ? 504 : 502 },
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
