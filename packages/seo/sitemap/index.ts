import fs from "node:fs";
import path from "node:path";
import {
	createSitemapXml,
	createRobotsTxt,
	createIndexSitemap,
	createFile,
} from "./utils";
import type { SitemapConfig, SitemapEntry } from "../types";

const sampleConfig: SitemapConfig = {
	outDir: "dist",
	minify: true,
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
};

export default function sitemapPlugin(config: SitemapConfig = sampleConfig) {
	const domain = config?.domain;
	if (!domain) {
		throw new Error("Domain is required for sitemap generation");
	}

	const outDir = config?.outDir || "dist";

	const createRobots = () => {
		const r = createRobotsTxt(`${domain}/sitemap.xml`);
		createFile(outDir, "robots.txt", r);
	};

	const createSitemap = async (filename: string, urls: SitemapEntry[]) => {
		const xml = await createSitemapXml(urls, { minify: config?.minify });
		createFile(outDir, `${filename}.xml`, xml);
	};

	return {
		name: "vite-plugin-sitemap",
		apply: "build",
		async closeBundle() {
			const outDir = path.resolve(process.cwd(), "dist");
			fs.mkdirSync(outDir, { recursive: true });
			const { sitemaps } = config;

			if (typeof sitemaps === "function") {
				// Single sitemap mode
				const urls = await sitemaps();
				createSitemap("sitemap.xml", urls);

				createRobots();
				console.log("✅ Generated single sitemap");
				return;
			}

			// Multi-sitemap mode (object)
			const allSitemaps: string[] = [];

			for (const [name, cb] of Object.entries(sitemaps)) {
				if (typeof cb !== "function") continue;
				const urls = await cb();
				createSitemap(`sitemap-${name}.xml`, urls);
				allSitemaps.push(`sitemap-${name}.xml`);
			}

			const indexXml = createIndexSitemap(allSitemaps, domain);
			createFile(outDir, "sitemap.xml", indexXml);

			createRobots();
			console.log(
				`✅ Generated ${allSitemaps.length} sitemaps + index + robots.txt`,
			);
		},
	};
}
