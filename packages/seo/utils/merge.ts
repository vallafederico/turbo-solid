import type { SanityImageAssetDocument } from "@sanity/client";
import { createMetaTitle } from "./meta-title";

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
	metadata?: {
		description?: string;
		canonicalUrl?: string;
		metaImage?: SanityImageAssetDocument;
		searchVisibility?: {
			noIndex?: boolean;
			noFollow?: boolean;
		};
	};
};

/**
 * Merged metadata result
 */
export type MergedMetadata = {
	title: string;
	description?: string;
	canonicalUrl: string;
	metaImage?: SanityImageAssetDocument;
	favicon?: SanityImageAssetDocument;
	twitterHandle?: string;
	noIndex?: boolean;
	noFollow?: boolean;
	schemaMarkup?: string;
};

/**
 * Merges page-level metadata with SEO defaults
 * Page metadata takes precedence over defaults
 */
export const mergeSeoData = (
	page: PageMetadata,
	seoDefaults: SeoDefaults,
): MergedMetadata => {
	if (!page || !seoDefaults) return {};

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
		favicon: seoDefaults.favicon,
		twitterHandle: seoDefaults.twitterHandle,
		...(page.metadata?.searchVisibility || {
			noIndex: false,
			noFollow: false,
		}),
		schemaMarkup: page.schemaMarkup,
	};
};
