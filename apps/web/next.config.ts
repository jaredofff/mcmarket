import type { NextConfig } from "next";
import path from "node:path";

const repoRoot = process.cwd().endsWith(path.join("apps", "web"))
  ? path.join(process.cwd(), "..", "..")
  : process.cwd();

const nextConfig: NextConfig = {
  turbopack: {
    root: repoRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
};

export default nextConfig;
