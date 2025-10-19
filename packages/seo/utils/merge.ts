import type { SanityImageAssetDocument } from "@sanity/client";
import { createMetaTitle } from "./meta-title";
import { createFavicons, Favicon } from "./favicon";

/**
 * Type for SEO defaults from seoDefaults singleton
 * Based on apps/cms/plugins/schema-markup/src/schemas/singleton/seo-defaults.ts
 */
export type SeoDefaults = {
	siteTitle: string;
	pageTitleTemplate: string;
	metaDescription?: string;
	siteUrl: string;
	favicon?: SanityImageAssetDocument;
	twitterHandle?: string;
};

/**
 * Type for page-level metadata
 * Based on apps/cms/plugins/schema-markup/src/schemas/fields/metadata/page-metadata.ts
 */
export type PageMetadata = {
	title: string;
	schemaMarkup?: string;
	metadata?: {
		description?: string;
		canonicalUrl?: string;
		metaImage?: SanityImageAssetDocument;
		searchVisibility?: {
			noIndex?: boolean;
			noFollow?: boolean;
		};
	};
	_createdAt?: string;
	_updatedAt?: string;
};

export type MergedMetadata = {
	title?: string;
	description?: string;
	canonicalUrl?: string;
	metaImage?: SanityImageAssetDocument;
	favicons?: Favicon[] | null;
	twitterHandle?: string;
	robots?: string;
	schemaMarkup?: string;
};

const buildRobotsString = ({
	noIndex = false,
	noFollow = false,
}: { noIndex?: boolean; noFollow?: boolean }) => {
	const parts = [];

	if (noIndex) parts.push("noindex");
	if (noFollow) parts.push("nofollow");

	if (parts.length === 0) return undefined;

	return parts.join(",");
};

/**
 * Merges page-level metadata with SEO defaults,
 * Page metadata takes precedence over defaults
 */
export const mergeSeoData = (
	page?: PageMetadata,
	seoDefaults?: SeoDefaults,
): MergedMetadata => {
	// If no data available, return minimal metadata
	if (!page && !seoDefaults) {
		console.warn("mergeSeoData: No page or seoDefaults provided");
		return {
			title: undefined,
			description: undefined,
		};
	}

	// If only defaults available
	if (!page) {
		console.warn("mergeSeoData: No page data provided");
		return {
			title: seoDefaults?.siteTitle,
			description: seoDefaults?.metaDescription,
			canonicalUrl: seoDefaults?.siteUrl,
			favicons: createFavicons(seoDefaults?.favicon),
			twitterHandle: seoDefaults?.twitterHandle,
		};
	}

	// If only page data available (no defaults)
	if (!seoDefaults) {
		console.warn("mergeSeoData: No seoDefaults provided");
		return {
			title: page.title,
			description: page.metadata?.description,
			canonicalUrl: page.metadata?.canonicalUrl,
			schemaMarkup: page.schemaMarkup,
		};
	}

	// Both page and defaults available - merge them
	return {
		// Generate title using template
		title: createMetaTitle(
			page.title,
			seoDefaults.siteTitle,
			seoDefaults.pageTitleTemplate,
		),
		// Page metadata overrides defaults
		description: page.metadata?.description || seoDefaults.metaDescription,
		canonicalUrl: page.metadata?.canonicalUrl || seoDefaults.siteUrl,
		metaImage: page.metadata?.metaImage,
		favicons: createFavicons(seoDefaults.favicon),
		twitterHandle: seoDefaults.twitterHandle,
		robots: buildRobotsString(
			page.metadata?.searchVisibility || { noIndex: false, noFollow: false },
		),
		schemaMarkup: page.schemaMarkup,
	};
};
