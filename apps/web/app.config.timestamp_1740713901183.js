// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";
import glsl from "vite-plugin-glsl";
import { solidStartSiteMapPlugin } from "solid-start-sitemap";
var sitemap = solidStartSiteMapPlugin({
  hostname: "https://example.com",
  replaceRouteParams: {
    ":postId": [1, 2, 3]
  },
  limit: 5e3
});
var plugins = [
  glsl({
    include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
    exclude: void 0,
    warnDuplicatedImports: true,
    defaultExtension: "glsl",
    compress: false,
    watch: true,
    root: "/"
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
  sitemap
];
var app_config_default = defineConfig({
  server: {
    prerender: {
      routes: ["/"],
      crawlLinks: true
    }
  },
  vite: {
    plugins
  }
});
export {
  app_config_default as default
};
