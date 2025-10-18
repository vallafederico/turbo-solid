import {
	mergeSeoData,
	type PageMetadata,
	type SeoDefaults,
	type MergedMetadata,
} from "./utils/merge";
import { composeSchema, type SchemaDefaults } from "./schema-markup";

export type BuildSeoPayloadParams = {
	globalDefaults?: SeoDefaults;
	schemaDefaults?: SchemaDefaults;
	pageSeo?: PageMetadata;
	pageSchemaType?: string;
	extraSchemaData?: Record<string, unknown>;
};

export type BuildSeoPayloadResult = {
	meta: MergedMetadata;
	schema?: unknown[];
};

/**
 * Builds the complete SEO payload for a page
 * Merges global defaults with page-specific metadata
 */
export function buildSeoPayload({
	globalDefaults,
	schemaDefaults,
	pageSeo,
	pageSchemaType,
	extraSchemaData,
}: BuildSeoPayloadParams): BuildSeoPayloadResult {
	// Merge SEO data: page metadata overrides global defaults
	const merged = mergeSeoData(pageSeo, globalDefaults);

	// Compose schema markup if defaults are provided
	const schema = schemaDefaults
		? composeSchema({
				seo: merged,
				schemaDefaults,
				type: pageSchemaType || "WebPage",
				extra: extraSchemaData,
			})
		: undefined;

	return {
		meta: merged,
		schema,
	};
}
