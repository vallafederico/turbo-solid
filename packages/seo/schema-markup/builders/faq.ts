// schema/builders/faq.ts
import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
import type { SchemaFAQItem } from "../types";

export function buildFAQPage({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const autoMap = schemaDefaults?.autoMap || {};

	// Use auto-mapping if enabled
	const name = autoMap.title !== false ? seo.title : extra?.name;
	const description =
		autoMap.description !== false ? seo.description : extra?.description;

	// Build mainEntity (FAQ items)
	const mainEntity = extra?.mainEntity
		? (extra.mainEntity as SchemaFAQItem[]).map((item: SchemaFAQItem) => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.answer,
				},
			}))
		: [];

	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		name,
		description,
		mainEntity,
		url: seo.canonicalUrl,
		isPartOf: seo.canonicalUrl
			? {
					"@type": "WebSite",
					"@id": `${seo.canonicalUrl}#website`,
				}
			: undefined,
	};
}
