import { defineType, defineField } from "sanity";

/**
 * jsonldAggregateRating
 * Represents the overall rating for a Product, LocalBusiness, or similar entity.
 *
 * Output example:
 * {
 *   "@type": "AggregateRating",
 *   "ratingValue": 4.7,
 *   "reviewCount": 128
 * }
 */

export const schemaMarkupAggregateRating = defineType({
	name: "schemaMarkupAggregateRating",
	title: "Aggregate Rating",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: "ratingValue",
			title: "Rating Value",
			type: "number",
			validation: (Rule) => Rule.min(1).max(5).precision(1),
			description: "Average rating value (usually between 1.0 and 5.0).",
		}),
		defineField({
			name: "reviewCount",
			title: "Review Count",
			type: "number",
			validation: (Rule) => Rule.min(0),
			description: "Total number of reviews included in this aggregate.",
		}),
		defineField({
			name: "bestRating",
			title: "Best Rating (Optional)",
			type: "number",
			description: "Optional maximum rating value (defaults to 5 if omitted).",
		}),
		defineField({
			name: "worstRating",
			title: "Worst Rating (Optional)",
			type: "number",
			description: "Optional minimum rating value (defaults to 1 if omitted).",
		}),
	],
	preview: {
		select: {
			value: "ratingValue",
			count: "reviewCount",
		},
		prepare({ value, count }) {
			return {
				title: value ? `⭐️ ${value.toFixed(1)} / 5` : "Aggregate Rating",
				subtitle: count ? `${count} reviews` : "",
			};
		},
	},
});
