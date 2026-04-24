// app.config.ts
import sitemapPlugin from "@crawl-me-maybe/sitemap";
import { defineConfig } from "@solidjs/start/config";
import componentDataAttr from "vite/vite-pulugin-component-attrs";
import glsl from "vite-plugin-glsl";
import solidSvg from "vite-plugin-solid-svg";

// vite/vite-plugin-gl-reload.js
function glReloadPlugin() {
  return {
    name: "vite-plugin-gl-reload",
    handleHotUpdate({ file, server }) {
      if (file.includes("/gl/")) {
        server.ws.send({
          type: "full-reload",
          path: "*"
        });
        return [];
      }
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
