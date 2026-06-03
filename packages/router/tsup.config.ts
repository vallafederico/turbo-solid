import { defineConfig } from "tsup";

/**
 * Solid libraries ship JSX *untransformed* so the consuming app's Solid
 * compiler can process it. We emit ESM + types and leave JSX as-is via the
 * `solid` export condition; the `import` build is a plain esbuild pass for
 * non-Solid-aware bundlers.
 *
 * In practice most SolidStart monorepos consume the package straight from
 * source through Vite's solid plugin — in that case point the workspace
 * dependency at `src/index.ts` and skip building entirely.
 */
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["solid-js", "@solidjs/router"],
  esbuildOptions(options) {
    options.jsx = "preserve";
  },
});
