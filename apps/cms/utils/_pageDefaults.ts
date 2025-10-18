import { MdArticle, MdSchema, MdSearch } from "react-icons/md";

export const pageDefaultsGroups = [
	{
		name: "social",
		title: "Social Media",
	},
	{
		name: "content",
		title: "Content",
		icon: MdArticle,
		default: true,
	},
	{
		name: "seo",
		title: "SEO",
		icon: MdSearch,
	},
	{
		name: "schema-markup",
		title: "Schema Markup",
		icon: MdSchema,
	},
];

export const pageDefaultsSeo = [
	{
		name: "meta",
		title: "Metadata",
		group: "seo",
		type: "object",
		fields: [
			{
				name: "description",
				title: "Description",
				type: "text",
				rows: 3,
				description:
					"The description displayed when a user finds the site in search results. Defaults to the description provided in Settings > SEO.",
				validation: (Rule) =>
					Rule.max(160).warning(
						"Long titles (over 160 characters) will be truncated by Google.",
					),
			},
			{
				name: "canonicalUrl",
				title: "Canonical URL",
				type: "url",
				description:
					"If this webpage has multiple URLs, specify the primary canonical URL that Google should index here",
			},
			{
				name: "metaImage",
				title: "Meta Image",
				// hidden: true,
				description:
					"Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.",
				type: "imageAlt",
			},
		],
	},
];
