import type { NextConfig } from "next";

/**
 * The Document Engine origin is resolved at REQUEST time by the route handlers
 * in app/api/ and app/files/ (see lib/docengine-origin.ts).
 *
 * It is deliberately not referenced here: `rewrites()` destinations are baked
 * into the build output, so configuring the engine in this file meant the PDF
 * path (/files/*) and the API path (/api/*) could resolve to different
 * backends, and changing the engine URL required a rebuild rather than a
 * restart.
 */
const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
