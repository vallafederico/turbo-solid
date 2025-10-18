import { defineType, defineField } from "sanity";

export const schemaMarkupFAQPageFields = defineType({
	name: "schemaMarkupFAQPageFields",
	title: "FAQ Page Fields",
	type: "object",
	fields: [
		defineField({
			name: "mainEntity",
			title: "FAQ Items",
			type: "array",
			of: [{ type: "schemaMarkupFAQItem" }], // {question:string, answer:PortableText}
			validation: (r) => r.min(1),
		}),
	],
	preview: {
		select: { count: "mainEntity.length" },
		prepare: ({ count }) => ({
			title: "FAQPage",
			subtitle: `${count || 0} item(s)`,
		}),
	},
});
