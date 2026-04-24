import type { NextConfig } from "next";
import path from "node:path";

/**
 * Next 16 requires `turbopack.root` and `outputFileTracingRoot` to match.
 * With that root, bare imports like `@import "tailwindcss"` resolve from the repo
 * `node_modules`, so Tailwind is listed in the root package.json for pnpm.
 */
const monorepoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
