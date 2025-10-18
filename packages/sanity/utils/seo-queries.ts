import { cache } from "@solidjs/router";
import { getDocumentByType } from "./query";

/**
 * Cached query for SEO defaults - shared across all pages
 * Cache key ensures it's only fetched once per request
 */
export const getSeoDefaults = cache(async () => {
	return getDocumentByType("seoDefaults");
}, "seo-defaults");

/**
 * Cached query for Schema Markup defaults - shared across all pages
 */
export const getSchemaDefaults = cache(async () => {
	return getDocumentByType("schemaMarkupDefaults");
}, "schema-defaults");
