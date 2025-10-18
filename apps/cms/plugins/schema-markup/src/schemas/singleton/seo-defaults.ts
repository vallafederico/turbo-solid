import { MdSearch, MdShare } from "react-icons/md";
import { defineField, defineType } from "sanity";
import FaviconPreview from "../../components/core/Favicon/FaviconPreview";

export const seoDefaults = defineType({
	name: "seoDefaults",
	title: "SEO Defaults",
	type: "document",
	groups: [
		{
			name: "metadata",
			title: "Metadata",
			default: true,
			icon: MdSearch,
		},
		{
			name: "social",
			title: "Social",
			icon: MdShare,
		},
	],
	fields: [
		defineField({
			name: "siteTitle",
			title: "Site Title",
			type: "string",
			description:
				"The title of the site. Used for the page title and the site title.",
			validation: (Rule) => Rule.required(),
			group: "metadata",
		}),
		defineField({
			name: "pageTitleTemplate",
			title: "Page Title Template",
			type: "string",
			description:
				"Template for page titles. Use {siteTitle} and {pageTitle} for the page title. Example: {pageTitle} - {siteTitle}",
			validation: (Rule) => Rule.required(),
			initialValue: "{pageTitle} - {siteTitle}",
			group: "metadata",
		}),
		defineField({
			name: "metaDescription",
			type: "metaDescription",
			group: "metadata",
			description: "The default meta description for all pages.",
			// validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "siteUrl",
			title: "Base URL",
			type: "url",
			description:
				"Root URL of the website (e.g. https://your-domain.com). Used for canonical and OG tags.",
			validation: (Rule) => Rule.required(),
			group: "metadata",
		}),
		defineField({
			name: "favicon",
			type: "image",
			components: {
				input: FaviconPreview,
			},
			description:
				"The favicon of the site. To create the sharpest fallback images possible, use an SVG. Careful with transparent backgrounds, a user might have light or dark mode enabled.",
			group: "metadata",
		}),
		defineField({
			name: "twitterHandle",
			title: "Twitter Handle",
			type: "string",
			description: "Example: @yourbrand",
			group: "social",
		}),
	],
	preview: {
		select: {
			title: "siteTitle",
			subtitle: "siteUrl",
		},
		prepare(selection) {
			return { title: "SEO Defaults" };
		},
	},
});
