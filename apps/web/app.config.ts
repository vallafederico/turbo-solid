import sitemapPlugin from "@crawl-me-maybe/sitemap";
import { defineConfig } from "@solidjs/start/config";
import glsl from "vite-plugin-glsl";
import solidSvg from "vite-plugin-solid-svg";
import componentDataAttr from "./vite/vite-plugin-component-attrs";
import glReloadPlugin from "./vite/vite-plugin-gl-reload";

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
	componentDataAttr(),
	sitemapPlugin({
		domain: "https://yourdomain.com",
		outDir: "dist",
		// robots:
		sitemaps: {
			pages: async () => [
				{ url: "/", updated: "2025-10-17" },
				{ url: "/about", updated: "2025-10-16" },
			],
			posts: async () => [
				{ url: "/blog/post-1", updated: "2025-10-10" },
				{ url: "/blog/post-2", updated: "2025-10-08" },
			],
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
