export type SitemapEntry = {
	url: string;
	lastmod?: string;
	changefreq?:
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never";
	/**
	 * Optional: An array of image URLs to associate with this page for Google Image sitemaps
	 */
	imageUrls?: string[];
	/**
	 * Optional: An array of video URLs to associate with this page (if video sitemap extensions desired)
	 */
	videoUrls?: string[];
	/**
	 * Optional: A priority value between 0.0 and 1.0, for sitemap.xml crawlers
	 */
	priority?: number;
};

export type SitemapConfig = {
	outDir?: string;
	domain?: string;
	minify?: boolean;
	sitemaps:
		| { [key: string]: () => Promise<SitemapEntry[]> }
		| (() => Promise<SitemapEntry[]>);
};
