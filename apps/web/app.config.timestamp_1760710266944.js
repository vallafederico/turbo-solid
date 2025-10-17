// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";
import glsl from "vite-plugin-glsl";

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
import sitemapPlugin from "@local/seo/sitemap/index";
console.log("sitemapPlugin", sitemapPlugin);
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
  sitemapPlugin({
    sitemaps: {
      pages: ["/", "/about/*"],
      posts: ["/blog/*"]
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
  sitemap,
  // Add our custom GL reload plugin
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
