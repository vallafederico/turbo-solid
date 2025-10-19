import {
	mergeSeoData,
	type PageMetadata,
	type SeoDefaults,
	type MergedMetadata,
} from "./utils/merge";
import { composeSchema, type SchemaDefaults } from "./schema-markup";
import type { Thing } from "schema-dts";

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
	schemas: Thing[] | undefined;
};

/**
 * Builds the complete SEO payload for a page
 * Merges global defaults with page-specific metadata
 */
export function buildSeoPayload({
	globalDefaults,
	schemaDefaults,
	pageSeo,
	pageSchemaType = "WebPage",
	extraSchemaData,
	isHomepage = false,
}: BuildSeoPayloadParams): BuildSeoPayloadResult {
	// Merge SEO data: page metadata overrides global defaults
	const merged = mergeSeoData(pageSeo, globalDefaults);

	// Compose schema markup if defaults are provided
	const schemas = schemaDefaults
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
		schemas,
	};
}
