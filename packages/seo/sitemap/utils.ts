import fs from "node:fs";
import path from "node:path";
import type { SitemapEntry } from "../types";

/**
 * Renders a sitemap.xml string for a list of URLs (SitemapEntry).
 * @param urls Array of SitemapEntry objects
 * @param opts Optional options { minify?: boolean }
 * @returns string (XML)
 */
export async function createSitemapXml(
	urls: SitemapEntry[],
	opts?: { minify?: boolean },
): Promise<string> {
	const now = new Date().toISOString();
	let imageNS = false;
	let videoNS = false;

	const items = urls
		.map((u) => {
			let xml = `<url><loc>${u.url}</loc><lastmod>${u.lastmod ?? now}</lastmod>`;
			if (u.changefreq) {
				xml += `<changefreq>${u.changefreq}</changefreq>`;
			}
			if (typeof u.priority === "number") {
				xml += `<priority>${u.priority.toFixed(1)}</priority>`;
			}
			if (u.imageUrls?.length) {
				imageNS = true;
				for (const img of u.imageUrls) {
					xml += `<image:image><image:loc>${img}</image:loc></image:image>`;
				}
			}
			if (u.videoUrls?.length) {
				videoNS = true;
				for (const vid of u.videoUrls) {
					xml += `<video:video><video:content_loc>${vid}</video:content_loc></video:video>`;
				}
			}
			xml += "</url>";
			return xml;
		})
		.join("");
	// Build the root tag with namespace(s) if needed
	const ns = [
		'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
		imageNS
			? 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
			: null,
		videoNS
			? 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'
			: null,
	]
		.filter(Boolean)
		.join(" ");
	let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>${items}</urlset>`;
	if (opts?.minify) {
		const { minify } = await import("minify-xml");
		xmlString = minify(xmlString);
	}
	return xmlString;
}

/**
 * Renders a sitemap index XML string.
 * @param files Array of string paths
 * @param baseUrl Site base url
 * @param opts Optional options { minify?: boolean }
 * @returns string (XML)
 */
export async function createIndexSitemap(
	files: string[],
	baseUrl: string,
	opts?: { minify?: boolean },
): Promise<string> {
	const items = files
		.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`)
		.join("");
	let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
	if (opts?.minify) {
		const { minify } = await import("minify-xml");
		xmlString = minify(xmlString);
	}
	return xmlString;
}

export function createRobotsTxt(indexUrl: string) {
	return `User-agent: *\nAllow: /\nSitemap: ${indexUrl}\n`;
}

export async function getUrlsForGroup(name: string, patterns: unknown[]) {
	return Promise.resolve(["/", "/about", "/blog/article-name"]);
}

export const createFile = (
	outputPath: string,
	filename: string,
	content: string,
) => {
	fs.writeFileSync(path.join(outputPath, filename), content);
};
