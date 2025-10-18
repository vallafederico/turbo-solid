import { defineType, defineField } from "sanity";

export const schemaMarkupArticleFields = defineType({
	name: "schemaMarkupArticleFields",
	title: "Article Fields",
	type: "object",
	fields: [
		defineField({
			name: "headline",
			type: "string",
			validation: (r) => r.required(),
		}),
		// defineField({ name: "articleSection", type: "string" }),
		// defineField({ name: "datePublished", type: "datetime" }),
		// defineField({ name: "dateModified", type: "datetime" }),
		defineField({
			name: "author",
			title: "Author(s)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
		defineField({
			name: "publisher",
			title: "Publisher",
			type: "schemaMarkupOrganization",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Article Image",
		// 	type: "jsonldImageObject",
		// }),
		// defineField({
		// 	name: "mainEntityOfPage",
		// 	type: "url",
		// 	description: "Canonical URL of the page hosting this article.",
		// }),
	],
	preview: {
		select: { title: "headline", subtitle: "articleSection" },
		prepare: ({ title, subtitle }) => ({ title: title || "Article", subtitle }),
	},
});
