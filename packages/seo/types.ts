/**
 * An entry describing a page for the sitemap.
 * See: https://www.sitemaps.org/protocol.html
 */
export type SitemapEntry = {
	/** Absolute or site-relative URL (should start with / or be fully qualified) */
	url: string;
	/** Optional ISO date or yyyy-mm-dd string for the last modification timestamp */
	lastmod?: string;
	/** Change frequency relative hint for crawlers */
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	/**
	 * Optional: An array of image URLs to associate with this entry (Google Images support)
	 * See: https://www.sitemaps.org/protocol.html#image_tag
	 */
	imageUrls?: string[];
	/**
	 * Optional: An array of video URLs to associate with this entry (Google Video/YouTube support)
	 * See: https://www.sitemaps.org/protocol.html#video_tag
	 */
	videoUrls?: string[];
	/**
	 * Optional: 0.0-1.0. Indicates the relative priority of this URL compared to other URLs on your site.
	 * See: https://www.sitemaps.org/protocol.html#prioritydef
	 */
	priority?: number;
};

/**
 * Main plugin configuration object for sitemap plugin.
 */
export type SitemapConfig = {
	/** Folder to output sitemap files (default: "dist") */
	outDir?: string;
	/** Base domain for absolute URL generation. REQUIRED. */
	domain: string;
	/**
	 * Either a callback that returns all sitemap entries (for small/medium sites),
	 * or an object of logical content group names to entry callbacks (for >50k URLs/sites with large sections).
	 */
	sitemaps:
		| { [key: string]: () => Promise<SitemapEntry[]> }
		| (() => Promise<SitemapEntry[]>);
	/**
	 * (Optional) Async function returning extra robots.txt content for custom rules.
	 * If not provided, a reasonable default is used.
	 * The correct Sitemap: ... line(s) will be appended automatically.
	 */
	robots?: () => Promise<string> | string;
	/**
	 * (Optional) If true, disables minification for all output XML. Defaults to false (so XML is minified by default for SEO best practices).
	 */
	disableMinification?: boolean;
};
