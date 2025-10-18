// src/schema/field.ts
import { defineType, defineField } from "sanity";
import { needs } from "../utils/needs";

export const schemaMarkupField = defineType({
	name: "schemaMarkup",
	title: "Schema Markup",
	type: "object",
	fields: [
		defineField({
			name: "type",
			title: "Schema Type",
			type: "string",
			options: {
				list: [
					{ title: "WebSite", value: "WebSite" },
					{ title: "WebPage", value: "WebPage" },
					{ title: "Article", value: "Article" },
					{ title: "Product", value: "Product" },
					{ title: "Event", value: "Event" },
					{ title: "FAQPage", value: "FAQPage" },
					// { title: "BreadcrumbList", value: "BreadcrumbList" },
					{ title: "Organization", value: "Organization" },
					{ title: "Person", value: "Person" },
					{ title: "LocalBusiness", value: "LocalBusiness" },
				],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		}),
		// Minimal common fields:
		defineField({
			name: "name",
			type: "string",
			hidden: ({ parent }) => !needs(parent, "name"),
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			hidden: ({ parent }) => !needs(parent, "description"),
		}),
		defineField({
			name: "inLanguage",
			type: "string",
			hidden: ({ parent }) => !needs(parent, "inLanguage"),
		}),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// 	hidden: ({ parent }) => !needs(parent, "image"),
		// }),
		// Type-specific groups (conditionally shown)
		// e.g., Article
		defineField({
			name: "article",
			type: "jsonldArticleFields",
			hidden: ({ parent }) => parent?.type !== "Article",
		}),
		// Product
		defineField({
			name: "product",
			type: "jsonldProductFields",
			hidden: ({ parent }) => parent?.type !== "Product",
		}),
		// ...repeat for Event, FAQPage, BreadcrumbList, etc.
	],
	components: { input: JsonLdInput }, // custom UI that merges defaults + shows preview
	preview: { select: { title: "type", subtitle: "name" } },
});
