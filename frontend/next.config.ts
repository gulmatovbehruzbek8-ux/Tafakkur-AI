import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
