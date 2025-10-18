import { defineField, defineType } from "sanity";

export const socialNetworks = defineType({
	name: "socialNetworks",
	title: "Social Networks",
	type: "document",
	fields: [
		defineField({
			name: "platform",
			title: "Platform",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "url",
			title: "URL",
			type: "url",
			validation: (Rule) => Rule.required(),
		}),
	],
});
