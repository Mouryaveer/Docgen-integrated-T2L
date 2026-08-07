import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/docengine/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      {
        source: "/files/:path*",
        destination: "http://localhost:8000/files/:path*",
      },
    ];
  },
};

export default nextConfig;
