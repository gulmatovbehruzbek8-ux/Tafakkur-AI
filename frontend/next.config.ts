import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    const rewrites = [
      {
        source: '/logo.png',
        destination: '/Logo.png',
      },
    ];

    // Only rewrite to an external backend if BACKEND_URL is explicitly configured
    if (backendUrl) {
      rewrites.push({
        source: '/api/backend/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/api/:path*`,
      });
    }

    return rewrites;
  },
};

export default nextConfig;
