import sitemapPlugin from "@crawl-me-maybe/sitemap";
import { defineConfig } from "@solidjs/start/config";
import glsl from "vite-plugin-glsl";
import solidSvg from "vite-plugin-solid-svg";
import glReloadPlugin from "./vite/vite-plugin-gl-reload";
import componentDataAttr from "./vite/vite-pulugin-component-attrs";

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
	}),
	glReloadPlugin(),
];

export default defineConfig({
	// `three` is a large, plain-JS library with no Solid JSX. solid-start adds
	// `.js`/`.ts` to vite-plugin-solid's extensions, so babel-preset-solid would
	// otherwise run over three's 1MB+ build files — that's what triggers the
	// "[BABEL] ... has deoptimised the styling ... exceeds the max of 500KB" note
	// and slows dev startup. Skip three (kept un-prebundled below so it resolves
	// to its real path) from the Solid Babel transform entirely.
	solid: {
		exclude: [/[\\/]three@/, /[\\/]node_modules[\\/]three[\\/]/],
	},
	server: {
		preset: "vercel",
		prerender: {
			crawlLinks: true,
			ignore: ["/_/shop", "/_/shop/**"],
		},
		vercel: {
			config: {
				bypassToken: process.env.VERCEL_BYPASS_TOKEN,
			},
		},
		routeRules: {
			"/_/shop": {
				isr: { expiration: 60, allowQuery: ["collection", "sort", "after"] },
				headers: { "cache-control": "public, max-age=0, must-revalidate" },
			},
			"/_/shop/**": {
				isr: { expiration: 60 },
				headers: { "cache-control": "public, max-age=0, must-revalidate" },
			},
			"/api/shopify/revalidate": { isr: false },
		},
	},
	vite: {
		plugins,
		resolve: {
			dedupe: ["@solidjs/router", "solid-js"],
		},
		optimizeDeps: {
			exclude: ["three"],
		},
	},
});
