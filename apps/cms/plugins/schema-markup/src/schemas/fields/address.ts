import { defineType, defineField } from "sanity";

/**
 * schemaMarkupAddress
 * Reusable inline PostalAddress object for JSON-LD entities.
 * Usually embedded inside Organization, Event, or LocalBusiness.
 *
 * Kept inline (not referenced) since most sites only have 1–few addresses.
 */

export const schemaMarkupAddress = defineType({
	name: "schemaMarkupAddress",
	title: "Postal Address",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: "streetAddress",
			title: "Street Address",
			type: "string",
			description: 'Street and number, e.g. "123 Main St".',
		}),
		defineField({
			name: "addressLocality",
			title: "City / Locality",
			type: "string",
		}),
		defineField({
			name: "addressRegion",
			title: "State / Region",
			type: "string",
		}),
		defineField({
			name: "postalCode",
			title: "Postal Code",
			type: "string",
		}),
		defineField({
			name: "addressCountry",
			title: "Country",
			type: "string",
			description:
				'ISO 3166-1 alpha-2 or country name (e.g. "US" or "United States").',
		}),
	],
	preview: {
		select: {
			street: "streetAddress",
			city: "addressLocality",
			region: "addressRegion",
			country: "addressCountry",
		},
		prepare({ street, city, region, country }) {
			const line1 = street ? street : "Address";
			const line2 = [city, region, country].filter(Boolean).join(", ");
			return {
				title: line1,
				subtitle: line2 || "",
			};
		},
	},
});
