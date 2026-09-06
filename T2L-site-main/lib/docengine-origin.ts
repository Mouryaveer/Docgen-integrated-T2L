/**
 * Single source of truth for the Document Engine (FastAPI) origin.
 *
 * This resolution logic previously existed in three places — next.config.ts
 * and both catch-all proxy route handlers — which is exactly the kind of
 * duplication that let production drift onto a stale backend URL.
 *
 * Production has one authoritative fallback. The local engine fallback is
 * kept for development only, so it can never become a deployment target.
 */

const PRODUCTION_ENGINE_URL = "https://turn2law-webiste-1.onrender.com";
const DEVELOPMENT_ENGINE_URL = "http://127.0.0.1:8000";

export function resolveEngineUrl(): string {
  const configured = process.env.DOCUMENT_GENERATION_API_URL;
  const fallback =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_ENGINE_URL
      : DEVELOPMENT_ENGINE_URL;
  return (configured || fallback).replace(/\/$/, "");
}

export const ENGINE_URL = resolveEngineUrl();
