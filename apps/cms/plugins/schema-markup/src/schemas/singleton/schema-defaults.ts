import { AiOutlineGlobal } from "react-icons/ai";
import { MdSettingsSuggest } from "react-icons/md";
import { defineType, defineField } from "sanity";

export const schemaMarkupDefaults = defineType({
	name: "schemaMarkupDefaults",
	title: "Schema Markup Defaults",
	type: "document",
	groups: [
		{
			name: "global",
			title: "Global Defaults",
			default: true,
			icon: AiOutlineGlobal,
		},
		{
			name: "type-specific",
			title: "Type-Specific Defaults",
			icon: MdSettingsSuggest,
		},
	],
	// mark as singleton in your desk (see snippet below)
	fields: [
		// IN OTHER PLACE ALREADY
		// ---- General ----
		// defineField({
		// 	name: "baseUrl",
		// 	title: "Base URL",
		// 	type: "url",
		// 	description: "Root URL used to build canonical links in JSON-LD.",
		// 	validation: (r) => r.required(),
		// }),
		// defineField({
		// 	name: "defaultLocale",
		// 	title: "Default Locale",
		// 	type: "string",
		// 	description: "2-letter language code (e.g., en, it, de).",
		// 	validation: (r) => r.required().max(2),
		// }),

		// GETTING THESE FROM CODEBASE, NOT CMS
		// defineField({
		// 	name: "locales",
		// 	title: "Available Locales",
		// 	type: "array",
		// 	of: [{ type: "string" }],
		// 	description:
		// 		"List of supported locales. First should match defaultLocale.",
		// 	validation: (r) => r.min(1),
		// }),
		defineField({
			name: "sameAs",
			title: "Global Profiles (sameAs)",
			type: "array",
			group: "global",
			of: [{ type: "url" }],
			description: "Social/profile URLs applied when relevant.",
		}),

		defineField({
			name: "organization",
			title: "Default Organization",
			group: "global",
			type: "reference",
			to: [{ type: "schemaMarkupOrganization" }],
			description: "Used as publisher/brand when none specified.",
		}),
		defineField({
			name: "publisher",
			title: "Default Publisher (Overrides Organization)",
			group: "global",
			type: "reference",
			to: [{ type: "schemaMarkupOrganization" }],
		}),

		// ---- Image & Media Fallbacks ----
		defineField({
			name: "logo",
			title: "Global Logo",
			group: "global",
			type: "image",
			description:
				"Default logo used for Organization and WebSite schemas when no specific logo is provided.",
		}),
		defineField({
			name: "imageFallback",
			title: "Default Image",
			group: "global",
			type: "image",
			description: "Used if an entity has no image set or auto-mapped.",
		}),
		defineField({
			name: "imageFieldMapping",
			hidden: true,
			title: "Image Auto-Map Order",
			group: "global",
			type: "array",
			of: [{ type: "string" }],
			description:
				"Field paths (dot notation) searched on the document to auto-map an image. First match wins. Example: coverImage, seo.image, ogImage",
			options: { layout: "tags" },
			initialValue: ["coverImage", "seo.image", "ogImage", "mainImage"],
		}),

		// ---- Auto-Mapping Toggles ----
		defineField({
			name: "autoMap",
			title: "Automatic Field Mapping",
			group: "global",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{
					name: "title",
					type: "boolean",
					initialValue: true,
					description: "Map doc title → name/headline.",
				},
				{
					name: "description",
					type: "boolean",
					initialValue: true,
					description: "Map doc excerpt/description → description.",
				},
				{
					name: "image",
					type: "boolean",
					initialValue: true,
					description: "Use imageFieldMapping to find an image.",
				},
				{
					name: "dates",
					type: "boolean",
					initialValue: true,
					description:
						"Map publishedAt/updatedAt → datePublished/dateModified.",
				},
				{
					name: "authors",
					type: "boolean",
					initialValue: true,
					description: "Map authors[] → Person/Organization authors.",
				},
			],
		}),

		// ---- Type-Specific Defaults ----
		defineField({
			name: "webSite",
			title: "WebSite Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: false },
			fields: [
				{ name: "name", type: "string" },
				// {
				// 	name: "inLanguage",
				// 	type: "string",
				// 	description: "BCP-47 code. Fallback to defaultLocale.",
				// },
				{ name: "publisher", type: "schemaMarkupOrganization" },
				defineField({
					name: "searchAction",
					title: "SearchAction",
					type: "object",
					fields: [
						{
							name: "target",
							type: "url",
							description:
								"e.g. https://example.com/search?q={search_term_string}",
						},
						{
							name: "queryInput",
							type: "string",
							description: "e.g. required name=search_term_string",
						},
					],
				}),
			],
		}),

		defineField({
			name: "webPage",
			title: "WebPage Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "inLanguage", type: "string" },
				{ name: "primaryImageOfPage", type: "image" },
			],
		}),

		defineField({
			name: "article",
			title: "Article Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "publisher", type: "schemaMarkupOrganization" },
				{
					name: "section",
					type: "string",
					description: "Default ArticleSection.",
				},
			],
		}),

		defineField({
			name: "product",
			title: "Product Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "brand", type: "schemaMarkupOrganization" },
				{
					name: "priceCurrency",
					type: "string",
					description: "ISO 4217, e.g., USD, EUR.",
				},
				{
					name: "availability",
					type: "string",
					options: {
						list: [
							{ title: "InStock", value: "InStock" },
							{ title: "OutOfStock", value: "OutOfStock" },
							{ title: "PreOrder", value: "PreOrder" },
							{ title: "PreSale", value: "PreSale" },
							{ title: "Discontinued", value: "Discontinued" },
						],
					},
				},
			],
		}),

		defineField({
			name: "event",
			title: "Event Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{
					name: "eventAttendanceMode",
					type: "string",
					options: {
						list: [
							{ title: "Offline", value: "OfflineEventAttendanceMode" },
							{ title: "Online", value: "OnlineEventAttendanceMode" },
							{ title: "Mixed", value: "MixedEventAttendanceMode" },
						],
					},
				},
				{ name: "organizer", type: "schemaMarkupOrganization" },
			],
		}),

		defineField({
			name: "localBusiness",
			title: "LocalBusiness Defaults",
			group: "type-specific",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{ name: "priceRange", type: "string", description: "e.g., $, $$, $$$" },
				{ name: "address", type: "schemaMarkupAddress" },
				{ name: "geo", type: "schemaMarkupGeo" },
				{ name: "aggregateRating", type: "schemaMarkupAggregateRating" },
			],
		}),

		// ---- Rendering / Behavior ----
		defineField({
			name: "rendering",
			title: "Rendering Options",
			type: "object",
			options: { collapsible: true, collapsed: true },
			fields: [
				{
					name: "multiLocaleStrategy",
					type: "string",
					initialValue: "one-per-locale",
					options: {
						list: [
							{ title: "One <script> per locale", value: "one-per-locale" },
							{ title: "Primary locale only", value: "primary-only" },
						],
						layout: "radio",
					},
				},
			],
		}),
	],

	preview: {
		select: { baseUrl: "baseUrl", locale: "defaultLocale" },
		prepare: ({ baseUrl, locale }) => ({
			title: "Schema Markup Defaults",
			subtitle: `${baseUrl || "—"} · ${locale || "locale not set"}`,
		}),
	},
});
