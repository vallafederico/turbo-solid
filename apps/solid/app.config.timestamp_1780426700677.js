// app.config.ts
import sitemapPlugin from "@crawl-me-maybe/sitemap";
import { defineConfig } from "@solidjs/start/config";
import glsl from "vite-plugin-glsl";
import solidSvg from "vite-plugin-solid-svg";

// vite/vite-plugin-gl-reload.js
import path from "node:path";
import { fileURLToPath } from "node:url";
var normalize = (filePath) => filePath.replace(/\\/g, "/");
var currentDir = path.dirname(fileURLToPath(import.meta.url));
function glReloadPlugin() {
  const packagePath = normalize(path.resolve(currentDir, "../../packages/three"));
  const isWebglPackageFile = (file) => normalize(file).includes("/packages/three/");
  return {
    name: "vite-plugin-gl-reload",
    configureServer(server) {
      server.watcher.add(packagePath);
      const triggerFullReload = (file) => {
        if (!isWebglPackageFile(file)) return;
        server.ws.send({
          type: "full-reload",
          path: "*"
        });
      };
      server.watcher.on("add", triggerFullReload);
      server.watcher.on("change", triggerFullReload);
      server.watcher.on("unlink", triggerFullReload);
    },
    handleHotUpdate({ file, server }) {
      if (!isWebglPackageFile(file)) return;
      server.ws.send({
        type: "full-reload",
        path: "*"
      });
      return [];
    }
  };
}

// vite/vite-pulugin-component-attrs.ts
function componentDataAttr() {
  return {
    name: "vite-plugin-component-data",
    enforce: "pre",
    apply: "serve",
    // dev only
    async transform(code, id) {
      if (!id.endsWith(".tsx")) return;
      const match = id.match(/\/([^/]+)\.tsx$/);
      const componentName = match?.[1];
      if (!componentName || componentName[0] !== componentName[0].toUpperCase())
        return;
      const updated = code.replace(
        /return\s*\(\s*<([A-Za-z0-9]+)/,
        `return (<$1 data-component="${componentName}"`
      );
      return { code: updated, map: null };
    }
  };
}

// app.config.ts
var plugins = [
  glsl({
    include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
    exclude: void 0,
    warnDuplicatedImports: true,
    defaultExtension: "glsl",
    minify: false,
    watch: true,
    root: "/"
  }),
  componentDataAttr(),
  sitemapPlugin({
    domain: "https://yourdomain.com",
    outDir: "dist",
    sitemaps: {
      pages: async () => [
        { url: "/", updated: "2025-10-17" },
        { url: "/about", updated: "2025-10-16" }
      ],
      posts: async () => [
        { url: "/blog/post-1", updated: "2025-10-10" },
        { url: "/blog/post-2", updated: "2025-10-08" }
      ]
    }
  }),
  solidSvg({
    defaultAsComponent: true
    // svgo: {
    //   enabled: false,
    //   svgoConfig: {
    //     plugins: [
    //       {
    //         name: "preset-default",
    //         params: {
    //           overrides: {
    //             removeUselessDefs: false,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
  }),
  glReloadPlugin()
];
var app_config_default = defineConfig({
  server: {
    prerender: {
      // routes: ["/"],
      crawlLinks: true
    }
  },
  vite: {
    plugins
  }
  // solid: {
  //   hot: false,
  // },
});
export {
  app_config_default as default
};
