import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Pin the workspace root to this project. Without this, a stray
  // package.json/lockfile in a parent dir (e.g. ~/) makes Turbopack infer the
  // home folder as the root, broadening file-watching and slowing compiles.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react/dist/ssr"],
  },
};

export default nextConfig;