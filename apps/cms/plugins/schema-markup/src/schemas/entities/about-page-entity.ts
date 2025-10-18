import { defineType, defineField } from "sanity";

export const schemaMarkupAboutPageFields = defineType({
	name: "schemaMarkupAboutPageFields",
	title: "About Page Fields",
	type: "object",
	fields: [
		defineField({
			name: "name",
			type: "string",
			description: "Name of the about page (defaults to page title)",
		}),
		defineField({
			name: "description",
			type: "text",
			description:
				"Description of the about page (defaults to meta description)",
		}),
		defineField({
			name: "inLanguage",
			type: "string",
			description: "Language code (e.g., 'en-US')",
		}),
		defineField({
			name: "datePublished",
			type: "datetime",
			description: "When the page was first published",
		}),
		defineField({
			name: "dateModified",
			type: "datetime",
			description: "When the page was last modified",
		}),
		defineField({
			name: "about",
			title: "About (Entities)",
			type: "array",
			description: "People or organizations this page is about",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
	],
	preview: {
		select: { title: "name" },
		prepare: ({ title }) => ({ title: title || "About Page" }),
	},
});
