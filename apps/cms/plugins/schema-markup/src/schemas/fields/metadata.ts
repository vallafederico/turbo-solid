import PageSeoInput from "../../components/core/PageSeoInput/PageSeoInput";

export default {
	name: "metadata",
	title: "Metadata",
	group: "seo",
	components: {
		input: PageSeoInput,
	},
	type: "object",
	fields: [
		{
			name: "description",
			title: "Meta Description",
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
			name: "noIndex",
			title: "No Index",
			type: "boolean",
			description: "If true, the page will not be indexed by search engines.",
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
			description:
				"Displayed when the site link is posted on social media, defaults to a screenshot of the homepage.",
			type: "imageAlt",
		},
	],
};
