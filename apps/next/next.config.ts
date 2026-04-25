import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Next 16 requires `turbopack.root` and `outputFileTracingRoot` to match.
 * With that root, bare imports like `@import "tailwindcss"` resolve from the repo
 * `node_modules`, so Tailwind is listed in the root package.json for pnpm.
 */
const nextAppDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.join(nextAppDir, "../..");
const viteGlslLoader = path.join(nextAppDir, "loaders", "vite-glsl.cjs");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: ["@local/three", "@local/gl-context"],
  turbopack: {
    root: monorepoRoot,
    // Match apps/solid: `vite-plugin-glsl` inlines `#include` (not plain raw text).
    rules: {
      "*.vert": {
        loaders: [viteGlslLoader],
        as: "*.js",
      },
      "*.frag": {
        loaders: [viteGlslLoader],
        as: "*.js",
      },
      "*.glsl": {
        loaders: [viteGlslLoader],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
