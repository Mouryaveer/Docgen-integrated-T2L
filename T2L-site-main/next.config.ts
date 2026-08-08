import type { NextConfig } from "next";
import path from "path";

// Allow overriding backend URL for staging / production deployments.
// During local development this defaults to http://localhost:8000.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/docengine/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/files/:path*",
        destination: `${BACKEND_URL}/files/:path*`,
      },
    ];
  },
};

export default nextConfig;
