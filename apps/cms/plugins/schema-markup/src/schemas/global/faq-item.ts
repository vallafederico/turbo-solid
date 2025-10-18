import { defineType, defineField } from "sanity";

/**
 * jsonldFAQItem
 * Represents a single Question/Answer pair for the FAQPage JSON-LD type.
 * Used inside an array field on FAQPage entities.
 *
 * Matches Google’s recommended structure:
 * {
 *   "@type": "Question",
 *   "name": "Question text",
 *   "acceptedAnswer": {
 *     "@type": "Answer",
 *     "text": "Answer text"
 *   }
 * }
 */

export const schemaMarkupFAQItem = defineType({
	name: "schemaMarkupFAQItem",
	title: "FAQ Item",
	type: "object",
	options: { collapsible: true, collapsed: true },
	fields: [
		defineField({
			name: "question",
			title: "Question",
			type: "string",
			validation: (Rule) => Rule.required(),
			description:
				"The question being answered. (Used as the Question name in JSON-LD)",
		}),
		defineField({
			name: "answer",
			title: "Answer",
			type: "text",
			rows: 3,
			validation: (Rule) => Rule.required(),
			description:
				"The answer text. (Plain text is fine; HTML will be stripped in JSON-LD output)",
		}),
	],
	preview: {
		select: { title: "question", subtitle: "answer" },
		prepare({ title, subtitle }) {
			const shortAnswer =
				subtitle && subtitle.length > 60
					? subtitle.slice(0, 57).trim() + "…"
					: subtitle;
			return {
				title: title || "Untitled FAQ",
				subtitle: shortAnswer || "",
			};
		},
	},
});
