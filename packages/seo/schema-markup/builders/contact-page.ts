// schema/builders/contact-page.ts
import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
import type { SchemaImage } from "../types";
import { getImageUrl } from "./utils";

export function buildContactPage({
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
	const image = getImageUrl(
		autoMap.image !== false ? seo.metaImage : (extra?.image as SchemaImage),
		schemaDefaults?.imageFallback,
	);

	return {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		name: name || (extra?.name as string | undefined),
		description: description || (extra?.description as string | undefined),
		url: seo.canonicalUrl || (extra?.url as string | undefined),
		image,
		inLanguage:
			(extra?.inLanguage as string | undefined) || defaults.inLanguage,
		datePublished: (extra?.datePublished || extra?._createdAt) as
			| string
			| undefined,
		dateModified: (extra?.dateModified || extra?._updatedAt) as
			| string
			| undefined,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
