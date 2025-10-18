import { defineType, defineField } from "sanity";
import { createNote } from "../../../../../utils/create";

export const schemaMarkupProductFields = defineType({
	name: "schemaMarkupProductFields",
	title: "Product Fields",
	type: "object",
	fields: [
		createNote({
			description:
				"Name, image, offers, aggregateRating, reviews, description, and SKU are automatically generated from the product data.",
		}),
		// defineField({
		// 	name: "name",
		// 	type: "string",
		// 	validation: (r) => r.required(),
		// }),
		// defineField({ name: "description", type: "text" }),
		defineField({
			name: "brand",
			title: "Brand",
			type: "schemaMarkupOrganization",
		}),
		// defineField({
		// 	name: "sku",
		// 	type: "string",
		// 	description: "Stock keeping unit.",
		// }),
		defineField({
			name: "mpn",
			type: "string",
			description: "Manufacturer part number.",
		}),
		defineField({
			name: "gtin",
			type: "string",
			description: "GTIN (8/12/13/14).",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Primary Image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "offers",
		// 	title: "Offers",
		// 	type: "array",
		// 	of: [{ type: "jsonldOffer" }],
		// 	description: "Price, currency, availability, URL, itemCondition, etc.",
		// }),
		// defineField({
		// 	name: "aggregateRating",
		// 	title: "Aggregate Rating",
		// 	type: "jsonldAggregateRating",
		// }),
		// defineField({
		// 	name: "review",
		// 	title: "Reviews",
		// 	type: "array",
		// 	of: [{ type: "jsonldReview" }],
		// }),
	],
	preview: {
		select: { title: "name" },
		prepare: ({ title }) => ({ title: title || "Product" }),
	},
});
