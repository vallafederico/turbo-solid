import { defineType, defineField } from "sanity";

/**
 * JSON-LD CreativeWork Fields
 * Suitable for agency / case-study style content.
 * Uses existing shared types for Organization & Person references.
 */
export const jsonldCreativeWorkFields = defineType({
	name: "jsonldCreativeWorkFields",
	title: "Creative Work Fields",
	type: "object",
	fields: [
		defineField({
			name: "name",
			title: "Title / Name",
			type: "string",
			validation: (r) => r.required(),
			description: "The name of the creative work.",
		}),
		defineField({
			name: "headline",
			title: "Headline",
			type: "string",
			description: "Alternative title or marketing headline.",
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			description: "Short description of the work.",
		}),
		// defineField({
		// 	name: "inLanguage",
		// 	type: "string",
		// 	description: "BCP-47 language code (e.g. en, it, de).",
		// }),
		defineField({
			name: "creator",
			title: "Creator(s)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
			description:
				"Person(s) or organization(s) primarily responsible for creating this work.",
		}),
		defineField({
			name: "publisher",
			title: "Publisher / Agency",
			type: "schemaMarkupOrganization",
			description: "Organization publishing or releasing this work.",
		}),
		defineField({
			name: "client",
			title: "Client (Service Client)",
			type: "schemaMarkupOrganization",
			description: "Client or customer the work was produced for.",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Primary Image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "url",
		// 	type: "url",
		// 	description: "Canonical URL of this creative work.",
		// }),
		// defineField({
		// 	name: "datePublished",
		// 	type: "datetime",
		// 	description: "When the work was first published.",
		// }),
		// defineField({
		// 	name: "dateModified",
		// 	type: "datetime",
		// 	description: "When the work was last modified.",
		// }),
		defineField({
			name: "keywords",
			type: "array",
			of: [{ type: "string" }],
			options: { layout: "tags" },
			description: "Optional keywords or tags describing this work.",
		}),
		defineField({
			name: "about",
			title: "About (Topics)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
			description: "Things or entities this work is about.",
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "publisher.organization.name",
			media: "image",
		},
		prepare: ({ title, subtitle, media }) => ({
			title: title || "Creative Work",
			subtitle: subtitle ? `Publisher: ${subtitle}` : "CreativeWork",
			media,
		}),
	},
});
