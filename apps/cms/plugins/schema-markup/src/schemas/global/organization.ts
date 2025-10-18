// const merge = (globalOfType, pageOfType, concat: string[]) => {};

import { defineType, defineField } from "sanity";

export const schemaMarkupOrganization = defineType({
	name: "schemaMarkupOrganization",
	title: "Organization (Ref or Inline)",
	type: "object",
	options: { collapsible: true, collapsed: true },
	validation: (Rule) =>
		Rule.custom((val) => {
			if (!val) return true;
			const hasRef = !!val.organization?._ref;
			const hasInline = !!val.name;
			return (
				hasRef ||
				hasInline ||
				"Provide an organization reference or set a Name."
			);
		}),
	fields: [
		defineField({
			name: "name",
			title: "Name (Inline)",
			type: "string",
			description: "Inline fallback/override if no reference is set.",
		}),
		defineField({
			name: "url",
			title: "URL (Inline)",
			type: "url",
		}),
		// defineField({
		// 	name: "logo",
		// 	title: "Logo (Inline)",
		// 	type: "jsonldImageObject", // shared image object type
		// }),
		defineField({
			name: "sameAs",
			title: "Profiles (sameAs)",
			type: "array",
			of: [{ type: "url" }],
			options: { layout: "tags" },
		}),
	],
	preview: {
		select: {
			refName: "organization.name",
			refUrl: "organization.url",
			inlineName: "name",
			inlineUrl: "url",
			logoUrl: "logo.asset.url",
			isDefault: "isDefault",
		},
		prepare: ({ refName, inlineName, logoUrl, isDefault }) => {
			const title = refName || inlineName || "Organization";

			const subtitle = isDefault ? "⭐ Default" : "";
			return {
				title,
				subtitle,
				media: logoUrl ? ({ asset: { url: logoUrl } } as any) : undefined,
			};
		},
	},
});
