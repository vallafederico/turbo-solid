// schema/builders/article.ts
import { createSchemaImageObject } from "../../utils";
import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
import type { SchemaImage, SchemaPerson, SchemaOrganization } from "../types";
import { buildPersonOrOrg, buildOrgSchema, formatSchemaDate } from "./utils";

export function buildArticle({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.article || {};
	const autoMap = schemaDefaults?.autoMap || {};

	// Use auto-mapping if enabled
	const headline =
		autoMap.title !== false
			? seo.title
			: (extra?.headline as string | undefined);
	const description =
		autoMap.description !== false
			? seo.description
			: (extra?.description as string | undefined);
	const image = createSchemaImageObject(
		autoMap.image !== false ? seo.metaImage : (extra?.image as SchemaImage),
		schemaDefaults?.imageFallback,
	);

	// Build author array (use references since they're added as entities first)
	const authors = (extra?.author || []) as Array<
		SchemaPerson | SchemaOrganization
	>;
	const authorSchema =
		autoMap.authors !== false && authors.length > 0
			? authors
					.map((author) => buildPersonOrOrg(author, true, seo.canonicalUrl))
					.filter(Boolean)
			: undefined;

	// Build publisher (use reference since it's added as entity first)
	const publisher =
		(extra?.publisher as SchemaOrganization | undefined) ||
		defaults.publisher ||
		schemaDefaults?.publisher ||
		schemaDefaults?.organization;

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: headline || (extra?.headline as string | undefined),
		description: description || (extra?.description as string | undefined),
		image,
		datePublished: formatSchemaDate(
			autoMap.dates !== false
				? ((extra?._createdAt || extra?.datePublished) as
						| string
						| Date
						| undefined)
				: (extra?.datePublished as string | Date | undefined),
		),
		dateModified: formatSchemaDate(
			autoMap.dates !== false
				? ((extra?._updatedAt || extra?.dateModified) as
						| string
						| Date
						| undefined)
				: (extra?.dateModified as string | Date | undefined),
		),
		author: authorSchema,
		publisher: buildOrgSchema(publisher, true, seo.canonicalUrl), // Use reference
		mainEntityOfPage:
			seo.canonicalUrl || (extra?.mainEntityOfPage as string | undefined),
		articleSection:
			(extra?.articleSection as string | undefined) || defaults.section,
		url: seo.canonicalUrl,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
