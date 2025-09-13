import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        hostname: "api.dicebear.com",
      },
      {
        hostname: "volunteer.alkhidmat.org",
      },
    ],
  },
};

export default nextConfig;
