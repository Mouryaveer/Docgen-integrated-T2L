import type { NextConfig } from "next";

const ENGINE_URL = (
  process.env.DOCUMENT_GENERATION_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://turn2law-webiste-1.onrender.com"
    : "http://127.0.0.1:8000")
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/docengine/:path*",
        destination: ENGINE_URL + "/api/:path*",
      },
      {
        source: "/api/:path*",
        destination: ENGINE_URL + "/api/:path*",
      },
      {
        source: "/files/:path*",
        destination: ENGINE_URL + "/files/:path*",
      },
    ];
  },
};

export default nextConfig;
