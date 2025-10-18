import { MdPerson } from "react-icons/md";
import { defineType, defineField } from "sanity";

/**
 * schemaMarkupPerson
 * Used wherever you need to reference a person (e.g., author, creator, performer, reviewer).
 * Lets editors either reference an existing Person document or enter inline details.
 */

export const schemaMarkupPerson = defineType({
	name: "schemaMarkupPerson",
	title: "Person",
	type: "document",
	icon: MdPerson,
	validation: (Rule) =>
		Rule.custom((val) => {
			if (!val) return true;
			const hasRef = !!val.person?._ref;
			const hasInline = !!val.name;
			return hasRef || hasInline || "Provide a person reference or set a Name.";
		}),
	fields: [
		// defineField({
		// 	name: "person",
		// 	title: "Reference",
		// 	type: "reference",
		// 	to: [{ type: "person" }], // change if your base person doc uses a different type name
		// 	weak: true,
		// 	description: "Preferred: reference a Person document.",
		// }),
		defineField({
			name: "name",
			title: "Name (Inline)",
			type: "string",
			description: "Inline fallback or override if no reference is set.",
		}),
		defineField({
			name: "url",
			title: "URL (Inline)",
			type: "url",
			description: "Personal website or profile URL.",
		}),
		// defineField({
		// 	name: "image",
		// 	title: "Image (Inline)",
		// 	type: "jsonldImageObject", // reuse shared type
		// }),
		defineField({
			name: "sameAs",
			title: "Profiles (sameAs)",
			type: "array",
			of: [{ type: "url" }],
			options: { layout: "tags" },
			description:
				"Social or professional profiles associated with this person.",
		}),
		defineField({
			name: "jobTitle",
			title: "Job Title (Optional)",
			type: "string",
			description: "Role or title, if relevant (optional, ignored by Google).",
		}),
		defineField({
			name: "affiliation",
			title: "Affiliation (Optional)",
			type: "array",
			of: [{ type: "schemaMarkupOrganization" }],
			description: "Organizations this person is affiliated with.",
		}),
	],
	preview: {
		select: {
			refName: "person.name",
			inlineName: "name",
			refImage: "person.image",
			inlineImage: "image",
		},
		prepare: ({ refName, inlineName }) => ({
			title: refName || inlineName || "Person",
			subtitle: refName ? "Referenced" : "Inline",
		}),
	},
});
