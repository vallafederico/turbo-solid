// schema/builders/product.ts
import { createSchemaImageObject } from "../../utils";
import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
import type { SchemaImage } from "../types";
import { buildOrgSchema } from "./utils";

export function buildProduct({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.product || {};
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

	// Build brand (use reference since it's added as entity first)
	const brand = extra?.brand || defaults.brand;

	// Build offers
	const offers =
		extra?.offers ||
		(extra?.price
			? {
					"@type": "Offer",
					price: extra.price,
					priceCurrency: extra.priceCurrency || defaults.priceCurrency || "USD",
					availability: `https://schema.org/${extra.availability || defaults.availability || "InStock"}`,
					url: seo.canonicalUrl,
				}
			: undefined);

	return {
		"@context": "https://schema.org",
		"@type": "Product",
		name: name || (extra?.name as string | undefined),
		description: description || (extra?.description as string | undefined),
		image,
		brand: buildOrgSchema(brand, true, seo.canonicalUrl), // Use reference
		sku: extra?.sku as string | undefined,
		mpn: extra?.mpn as string | undefined,
		gtin: extra?.gtin as string | undefined,
		offers,
		aggregateRating: extra?.aggregateRating,
		review: extra?.review,
		url: seo.canonicalUrl,
	};
}
