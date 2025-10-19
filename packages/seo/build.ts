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
	isHomepage?: boolean;
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
	isHomepage = false,
}: BuildSeoPayloadParams): BuildSeoPayloadResult {
	// Merge SEO data: page metadata overrides global defaults
	const merged = mergeSeoData(pageSeo, globalDefaults);

	console.log({ pageSchemaType });

	// Compose schema markup if defaults are provided
	const schema =
		pageSchemaType && schemaDefaults
			? composeSchema({
					seo: merged,
					schemaDefaults,
					type: pageSchemaType || "WebPage",
					extra: extraSchemaData,
					isHomepage,
				})
			: undefined;

	return {
		meta: merged,
		schema,
	};
}
