import { defineType, defineField } from "sanity";

export const schemaMarkupPersonFields = defineType({
	name: "schemaMarkupPersonFields",
	title: "Person Fields",
	type: "object",
	fields: [
		defineField({
			name: "name",
			type: "string",
			validation: (r) => r.required(),
		}),
		// defineField({ name: "jobTitle", type: "string" }),
		// defineField({ name: "url", type: "url" }),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// }),
		defineField({
			name: "sameAs",
			title: "Profiles (sameAs)",
			type: "array",
			of: [{ type: "url" }],
		}),
		defineField({
			name: "affiliation",
			title: "Affiliation (Organizations)",
			type: "array",
			of: [{ type: "schemaMarkupOrganization" }],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "jobTitle" },
		prepare: ({ title, subtitle }) => ({ title: title || "Person", subtitle }),
	},
});
