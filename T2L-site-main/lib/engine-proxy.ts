import { NextRequest, NextResponse } from "next/server";
import { ENGINE_URL } from "./docengine-origin";

/**
 * Shared reverse proxy for the Document Engine.
 *
 * Both /api/* and /api/docengine/* route handlers delegate here so the two
 * entry points cannot diverge (they were previously byte-identical copies).
 */

// Hop-by-hop and connection-scoped request headers must not be forwarded.
// `content-length` in particular becomes wrong the moment the body is
// re-serialised, and `accept-encoding` would ask the upstream to compress a
// body that fetch has already transparently decoded.
const STRIPPED_REQUEST_HEADERS = [
  "host",
  "origin",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
];

// A cold Render instance plus two XeLaTeX passes can legitimately take well
// over a minute; the platform default would abort the request mid-compile and
// surface as a generic network failure in the wizard.
const UPSTREAM_TIMEOUT_MS = 120_000;

export async function proxyToEngine(
  request: NextRequest,
  pathSegments: string[],
  prefix: "api" | "files" = "api",
): Promise<NextResponse> {
  const safePath = pathSegments.map(encodeURIComponent).join("/");
  const upstreamUrl = `${ENGINE_URL}/${prefix}/${safePath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  for (const header of STRIPPED_REQUEST_HEADERS) headers.delete(header);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  try {
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (error) {
    // Return the engine-shaped error envelope the wizard already understands
    // instead of letting Next.js render an opaque 500 HTML page, which the
    // client's `response.json()` would then fail to parse.
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      {
        success: false,
        error: timedOut
          ? "The document engine took too long to respond. Please try again."
          : "Cannot reach the document engine. The backend server may be unavailable.",
      },
      { status: timedOut ? 504 : 502 },
    );
  }
}

export function engineCorsPreflight(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
