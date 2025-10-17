export const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
`;

/**
 * Generates robots.txt string referencing sitemap.xml or custom sitemaps as needed.
 * @param indexUrl Fully-qualified URL for the produced sitemap.xml
 * @returns Standard robots.txt content
 */
export function createRobotsTxt(indexUrl: string): string {
	if (!indexUrl || typeof indexUrl !== "string") {
		throw new Error("createRobotsTxt: indexUrl must be a non-empty string");
	}
	return `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${indexUrl}\n`;
}
