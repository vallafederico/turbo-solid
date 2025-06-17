import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";
import glsl from "vite-plugin-glsl";
import { solidStartSiteMapPlugin } from "solid-start-sitemap";

const sitemap = solidStartSiteMapPlugin({
  hostname: "https://example.com",
  replaceRouteParams: {
    ":postId": [1, 2, 3],
  },
  limit: 5000,
});

const plugins = [
  glsl({
    include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
    exclude: undefined,
    warnDuplicatedImports: true,
    defaultExtension: "glsl",
    minify: false,
    watch: true,
    root: "/",
  }),

  solidSvg({
    defaultAsComponent: true,
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
];

export default defineConfig({
  server: {
    prerender: {
      // routes: ["/"],
      crawlLinks: true /* prerenders all */,
    },
  },
  vite: {
    plugins,
  },
  // solid: {
  //   hot: false,
  // },
});
