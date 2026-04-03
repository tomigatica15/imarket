import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Docker builds (set NEXT_OUTPUT_STANDALONE=true in Dockerfile)
  // Skipped locally on Windows/OneDrive to avoid symlink permission errors
  output:
    process.env.NEXT_OUTPUT_STANDALONE === "true" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_GRAPHQL_URL ||
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      "http://localhost:3001/api/graphql";
    return [
      {
        source: "/api/graphql",
        destination: backendUrl,
      },
    ];
  },
};

export default nextConfig;
