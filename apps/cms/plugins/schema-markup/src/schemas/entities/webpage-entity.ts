import { defineType, defineField } from "sanity";

export const schemaMarkupWebPageFields = defineType({
	name: "schemaMarkupWebPageFields",
	title: "WebPage Fields",
	type: "object",
	fields: [
		defineField({ name: "name", type: "string" }),
		defineField({ name: "description", type: "text" }),
		defineField({ name: "inLanguage", type: "string" }),
		// defineField({ name: "primaryImageOfPage", type: "jsonldImageObject" }),
		defineField({ name: "datePublished", type: "datetime" }),
		defineField({ name: "dateModified", type: "datetime" }),
		// defineField({
		// 	name: "breadcrumb",
		// 	title: "Breadcrumb (optional)",
		// 	type: "jsonldBreadcrumbListFields",
		// }),
		defineField({
			name: "about",
			title: "About (Entities)",
			type: "array",
			of: [
				{ type: "schemaMarkupPerson" },
				{ type: "schemaMarkupOrganization" },
			],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "dateModified" },
		prepare: ({ title, subtitle }) => ({ title: title || "WebPage", subtitle }),
	},
});
