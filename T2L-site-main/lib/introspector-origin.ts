/**
 * Single source of truth for the Introspector (FastAPI RAG) backend origin.
 *
 * Mirrors lib/docengine-origin.ts: the origin is resolved at REQUEST time by
 * the app/api/introspector route handler, never baked into the build via
 * next.config.ts rewrites. That keeps the backend URL swappable with an env
 * var change (and a restart) instead of a rebuild.
 *
 * The backend service exposes `POST /api/query` and `GET /api/health`.
 * Configure the origin with INTROSPECTOR_API_URL (preferred). LAWGPT_API_URL
 * is accepted as a fallback because the underlying service is deployed from
 * the lawgpt repository. The production fallback matches that service's
 * render.yaml name; the local fallback matches its README port (8001).
 */

const PRODUCTION_INTROSPECTOR_URL = "https://lawgpt-fc90.onrender.com";
const DEVELOPMENT_INTROSPECTOR_URL = "http://127.0.0.1:8001";

export function resolveIntrospectorUrl(): string {
  const configured =
    process.env.INTROSPECTOR_API_URL || process.env.LAWGPT_API_URL;
  const fallback =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_INTROSPECTOR_URL
      : DEVELOPMENT_INTROSPECTOR_URL;
  return (configured || fallback).replace(/\/$/, "");
}

export const INTROSPECTOR_URL = resolveIntrospectorUrl();
