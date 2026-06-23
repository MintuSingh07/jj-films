import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/frames/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=7200, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
