import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";
import glsl from "vite-plugin-glsl";
import glReloadPlugin from "./vite/vite-plugin-gl-reload";
import sitemapPlugin from "../../packages/seo/sitemap";

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
	sitemapPlugin({
		sitemaps: {
			pages: ["/", "/about/*"],
			posts: ["/blog/*"],
		},
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

	// Add our custom GL reload plugin
	glReloadPlugin(),
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
