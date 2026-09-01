import type { NextConfig } from "next";

const ENGINE_URL = (process.env.DOCUMENT_GENERATION_API_URL || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    if (!ENGINE_URL) return [];
    return [
      {
        source: "/files/:path*",
        destination: ENGINE_URL + "/files/:path*",
      },
    ];
  },
};

export default nextConfig;
