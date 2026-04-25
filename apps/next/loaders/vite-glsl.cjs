/**
 * Turbopack/Webpack: inline `#include` the same way as Vite + `vite-plugin-glsl`.
 *
 * We resolve `loadShader.js` with **filesystem paths only** (no `require("vite-plugin-glsl")`
 * or `.../package.json`) so pnpm + Turbopack never hit invalid package "exports" for
 * `./package.json` when analyzing the loader in dev.
 */
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const VITE_GLSL_SHARD = path.join("vite-plugin-glsl", "src", "loadShader.js");
let loadShaderPromise;

/**
 * @param {string} loaderDir `__dirname` of this file (`…/apps/next/loaders`)
 * @returns {string} absolute path to loadShader.js
 */
function findLoadShaderPath(loaderDir) {
  // `node_modules` is next to `loaders/`, not inside it
  let dir = path.resolve(loaderDir, "..");
  for (let i = 0; i < 14; i++) {
    const inApp = path.join(dir, "node_modules", VITE_GLSL_SHARD);
    if (fs.existsSync(inApp)) return inApp;
    const pnpmFlat = path.join(
      dir,
      "node_modules",
      ".pnpm",
      "node_modules",
      VITE_GLSL_SHARD,
    );
    if (fs.existsSync(pnpmFlat)) return pnpmFlat;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    '[vite-glsl] Could not find vite-plugin-glsl/src/loadShader.js. Add devDependency "vite-plugin-glsl" to the Next app.',
  );
}

/**
 * @param {string} loaderDir
 * @returns {Promise<import("vite-plugin-glsl/src/loadShader.js").default>}
 */
function getLoadShader(loaderDir) {
  loadShaderPromise ??= (async () => {
    const loadShaderPath = findLoadShaderPath(loaderDir);
    const { default: loadShader } = await import(
      pathToFileURL(loadShaderPath).href
    );
    return loadShader;
  })();

  return loadShaderPromise;
}

module.exports = function viteGlslLoader(source) {
  const done = this.async();
  const resource = this.resourcePath;

  (async () => {
    const loadShader = await getLoadShader(__dirname);
    const { outputShader } = await loadShader(
      typeof source === "string" ? source : source.toString("utf8"),
      resource,
      {
        defaultExtension: "glsl",
        importKeyword: "#include",
        minify: false,
        root: "/",
        warnDuplicatedImports: true,
        removeDuplicatedImports: false,
        watch: false,
      },
    );
    done(null, `export default ${JSON.stringify(outputShader)};`);
  })().catch((err) => {
    done(err);
  });
};
