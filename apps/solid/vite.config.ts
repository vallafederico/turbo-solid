import sitemapPlugin from "@crawl-me-maybe/sitemap";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import solidSvg from "vite-plugin-solid-svg";
import glReloadPlugin from "./vite/vite-plugin-gl-reload.js";
import componentDataAttr from "./vite/vite-pulugin-component-attrs.ts";

export default defineConfig({
	plugins: [
		solidStart({
			// `three` is a large, plain-JS library with no Solid JSX. solid-start adds
			// `.js`/`.ts` to vite-plugin-solid's extensions, so babel-preset-solid would
			// otherwise run over three's 1MB+ build files — that's what triggers the
			// "[BABEL] ... has deoptimised the styling ... exceeds the max of 500KB" note
			// and slows dev startup. Skip three (kept un-prebundled below so it resolves
			// to its real path) from the Solid Babel transform entirely.
			solid: {
				exclude: [/[\\/]three@/, /[\\/]node_modules[\\/]three[\\/]/],
			},
		}),
		nitro(),
		tailwindcss(),
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
	],
	nitro: {
		preset: "vercel",
		prerender: {
			// `/` opts out of prerendering below, so it can no longer seed the
			// crawl. Any page in the shared `_` layout exposes the same nav, so
			// seeding from one reaches every statically renderable route.
			crawlLinks: true,
			routes: ["/_/about"],
		},
		vercel: {
			config: {
				bypassToken: process.env.VERCEL_BYPASS_TOKEN,
			},
		},
		// Routes absent from this map are prerendered to static HTML (CDN, no
		// invocation). Everything below opts out of prerendering, either because
		// it is data-backed — the `filesystem` handler is matched before the ISR
		// rewrites, so a prerendered file would shadow its own ISR function — or
		// because its output is request-specific and must never be baked.
		routeRules: {
			// Sanity-backed. This belongs on ISR, but an `isr` rule on the root
			// route makes Nitro emit the `index-isr.func` symlink twice and the
			// build dies with EEXIST, so it uses CDN caching instead.
			"/": {
				prerender: false,
				headers: {
					"cache-control": "public, s-maxage=60, stale-while-revalidate=300",
				},
			},
			"/_/content": {
				isr: { expiration: 60 },
				prerender: false,
			},
			// Renders the viewer's own cart from an httpOnly cookie, which the
			// shared `/_/shop/**` ISR cache below does not key on.
			"/_/shop/cart": {
				isr: false,
				prerender: false,
			},
			"/_/shop": {
				isr: { expiration: 60, allowQuery: ["collection", "sort", "after"] },
				headers: { "cache-control": "public, max-age=0, must-revalidate" },
				prerender: false,
			},
			"/_/shop/**": {
				isr: { expiration: 60 },
				headers: { "cache-control": "public, max-age=0, must-revalidate" },
				prerender: false,
			},
			// Cookie-gated and env-dependent. Neither is linked from the nav today,
			// so the crawler misses them, but that is the only thing keeping them
			// out of the static output.
			"/_/protected": { prerender: false },
			"/_/protected/**": { prerender: false },
			"/_/env": { prerender: false },
			"/api/shopify/revalidate": { isr: false },
		},
	},
	environments: {
		client: {
			define: {
				// `@local/config` reads VERCEL_URL at module scope and is reachable from
				// the browser bundle. Vite only substitutes NODE_ENV automatically, so
				// anything else off `process.env` has to be inlined explicitly.
				"process.env.VERCEL_URL": JSON.stringify(
					process.env.VERCEL_URL ?? "",
				),
			},
		},
	},
	resolve: {
		dedupe: ["@solidjs/router", "solid-js"],
	},
	optimizeDeps: {
		exclude: ["three"],
	},
});
