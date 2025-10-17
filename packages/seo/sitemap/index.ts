import fs from "node:fs";
import path from "node:path";
import { createSitemapXml, createIndexSitemap, createFile } from "./utils";
import { createRobotsTxt, DEFAULT_ROBOTS_TXT } from "../robots";
import type { SitemapConfig, SitemapEntry } from "../types";

// Reasonable default robots.txt rules


const sampleConfig: SitemapConfig = {
	outDir: "dist",
	domain: "https://yourdomain.com",
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
	robots: async () => DEFAULT_ROBOTS_TXT,
};

export default function sitemapPlugin(config: SitemapConfig = sampleConfig) {
	const domain = config?.domain;
	if (!domain) {
		throw new Error("Domain is required for sitemap generation");
	}

	const outDir = config?.outDir || "dist";

	/**
	 * Creates robots.txt handling custom async/user rules and always adds sitemaps at the end.
	 * @param sitemapsUrls - array of string (relative to domain)
	 */
	const createRobots = async (sitemapsUrls: string[] = ["/sitemap.xml"]) => {
		let userRobots = DEFAULT_ROBOTS_TXT;
		if (config.robots && typeof config.robots === "function") {
			try {
				const result = await config.robots();
				if (typeof result === "string") {
					userRobots = result;
				}
			} catch (err) {
				console.warn("[SEO] Error in user robots async callback", err);
			}
		}
		let content = userRobots.trim();
		if (!content.endsWith("\n")) content += "\n";
		// Ensure no duplicate Sitemap: lines
		const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
		for (const rel of sitemapsUrls) {
			content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `${"/"}${rel}`}\n`;
		}
		createFile(outDir, "robots.txt", content);
	};

	const createSitemap = async (filename: string, urls: SitemapEntry[]) => {
		const xml = await createSitemapXml(urls, { minify: config?.minify });
		createFile(outDir, `${filename}.xml`, xml);
	};

	return {
		name: "vite-plugin-sitemap",
		apply: "build",
		async closeBundle() {
			const outDir = path.resolve(process.cwd(), config?.outDir || "dist");
			fs.mkdirSync(outDir, { recursive: true });
			const { sitemaps } = config;

			if (typeof sitemaps === "function") {
				// Single sitemap mode
				const urls = await sitemaps();
				await createSitemap("sitemap.xml", urls);
				await createRobots(["/sitemap.xml"]);
				console.log("✅ Generated single sitemap");
				return;
			}

			// Multi-sitemap mode (object)
			const allSitemaps: string[] = [];
			for (const [name, cb] of Object.entries(sitemaps)) {
				if (typeof cb !== "function") continue;
				const urls = await cb();
				await createSitemap(`sitemap-${name}.xml`, urls);
				allSitemaps.push(`/sitemap-${name}.xml`);
			}

			const indexXml = await createIndexSitemap(
				allSitemaps.map((s: string) => s.slice(1)),
				domain,
				{ minify: config?.minify },
			);
			createFile(outDir, "sitemap.xml", indexXml);
			await createRobots(["/sitemap.xml", ...allSitemaps]);
			console.log(
				`✅ Generated ${allSitemaps.length} sitemaps + index + robots.txt`,
			);
		},
	};
}
