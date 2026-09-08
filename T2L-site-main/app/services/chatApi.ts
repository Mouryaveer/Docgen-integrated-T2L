/**
 * Chat API Service Layer for Turn2Law Legal AI Assistant
 * Routes through the same-origin Next.js proxy at /api/introspector
 * so the real backend URL never reaches the browser.
 */

export interface QueryRequest {
  query: string;
  model?: string;
}

export interface QueryResponse {
  response: string;
  model_used: string;
}

export interface HealthResponse {
  status: string;
  model?: string;
  rag_enabled?: boolean;
  pinecone_index?: string;
  pinecone_namespace?: string;
  embedding_model?: string;
  queue_size?: number;
}

/** Always use the same-origin proxy — no backend URL exposed to the client. */
export function getChatApiUrl(): string {
  return "";
}

/**
 * Sends a legal query via the Next.js reverse proxy at /api/introspector.
 */
export async function sendLegalQuery(
  query: string,
  model?: string
): Promise<QueryResponse> {
  const endpoint = "/api/introspector";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ query: query.trim(), model: model || undefined }),
    signal: AbortSignal.timeout(130_000),
  });

  if (!response.ok) {
    let detailMessage = `Server error (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson?.detail || errorJson?.error) {
        detailMessage =
          typeof (errorJson.detail || errorJson.error) === "string"
            ? errorJson.detail || errorJson.error
            : JSON.stringify(errorJson.detail || errorJson.error);
      }
    } catch {
      detailMessage = response.statusText || detailMessage;
    }
    throw new Error(detailMessage);
  }

  const data: QueryResponse = await response.json();
  return data;
}

/**
 * Checks backend health via the Next.js proxy.
 * The proxy forwards GET requests are not supported on /api/introspector
 * (POST only), so we do a lightweight POST with a trivial query instead.
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/introspector/health", {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return await response.json();
}
