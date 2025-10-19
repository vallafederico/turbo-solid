// schema/builders/about-page.ts
import { createSchemaImageObject } from "../../utils";
import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaImage } from "../types";

export function buildAboutPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.webPage || {};
	const autoMap = schemaDefaults?.autoMap || {};

	// Use auto-mapping if enabled
	const name =
		autoMap.title !== false ? seo.title : (extra?.name as string | undefined);
	const description =
		autoMap.description !== false
			? seo.description
			: (extra?.description as string | undefined);
	const image = createSchemaImageObject(
		autoMap.image !== false ? seo.metaImage : (extra?.image as SchemaImage),
		schemaDefaults?.imageFallback,
	);

	return {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: name || (extra?.name as string | undefined),
		description: coalesce(description, extra?.description) as string | undefined,
		url: coalesce(seo.canonicalUrl, extra?.url) as string | undefined,
		image,
		inLanguage: coalesce(extra?.inLanguage, defaults.inLanguage) as
			| string
			| undefined,
		datePublished: coalesce(extra?.datePublished, extra?._createdAt) as
			| string
			| undefined,
		dateModified: coalesce(extra?.dateModified, extra?._updatedAt) as
			| string
			| undefined,
		about: extra?.about,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
