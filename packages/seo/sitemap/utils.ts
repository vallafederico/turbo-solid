import fs from "node:fs";
import path from "node:path";
import type { SitemapEntry } from "../types";

/**
 * Generates a sitemap.xml string from a list of SitemapEntry objects.
 * Optionally minifies the output with minify-xml if opts.minify is true.
 * Throws an Error if minify or generation fails.
 */
export async function createSitemapXml(
	urls: SitemapEntry[],
	opts?: { minify?: boolean },
): Promise<string> {
	try {
		const now = new Date().toISOString();
		let imageNS = false;
		let videoNS = false;

		const items: string = urls
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
		const ns: string = [
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
			try {
				const { minify } = await import("minify-xml");
				xmlString = minify(xmlString);
			} catch (e) {
				throw new Error(
					`Sitemap XML minification failed: ${e instanceof Error ? e.message : String(e)}`,
				);
			}
		}
		return xmlString;
	} catch (err) {
		throw new Error(
			`Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}

/**
 * Generates a sitemapindex XML string for an array of sitemap file urls.
 * Throws an Error if minify or generation fails.
 */
export async function createIndexSitemap(
	files: string[],
	baseUrl: string,
	opts?: { minify?: boolean },
): Promise<string> {
	try {
		const items: string = files
			.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`)
			.join("");
		let xmlString = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
		if (opts?.minify) {
			try {
				const { minify } = await import("minify-xml");
				xmlString = minify(xmlString);
			} catch (e) {
				throw new Error(
					`Sitemap index minification failed: ${e instanceof Error ? e.message : String(e)}`,
				);
			}
		}
		return xmlString;
	} catch (err) {
		throw new Error(
			`Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
}

/**
 * Writes a file to a directory, creating the full path if needed. Throws on failure.
 */
export const createFile = (
	outputPath: string,
	filename: string,
	content: string,
): void => {
	try {
		fs.writeFileSync(path.join(outputPath, filename), content);
	} catch (err) {
		throw new Error(
			`Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`,
		);
	}
};
