import { defineField } from "sanity";

export default defineField({
	name: "metaDescription",
	title: "Meta Description",
	type: "text",
	rows: 3,
	description: "The description of the page. Used for the meta description.",
	validation: (Rule) =>
		Rule.max(160).warning(
			"Long descriptions (over 160 characters) will be truncated by Google.",
		),
});
