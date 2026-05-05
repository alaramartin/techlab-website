import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react/dist/ssr"],
  },
};

export default nextConfig;