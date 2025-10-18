// const merge = (globalOfType, pageOfType, concat: string[]) => {};

import { MdBusiness } from "react-icons/md";
import { defineType, defineField } from "sanity";

export const schemaMarkupOrganization = defineType({
	name: "schemaMarkupOrganization",
	icon: MdBusiness,
	title: "Organization",
	type: "document",
	validation: (Rule) =>
		Rule.custom((val) => {
			if (!val) return true;
			// biome-ignore lint: accessing dynamic properties
			const hasRef = !!(val as any).organization?._ref;
			// biome-ignore lint: accessing dynamic properties
			const hasInline = !!(val as any).name;
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
		defineField({
			name: "logo",
			title: "Logo (Inline)",
			type: "image", // shared image object type
		}),
		defineField({
			name: "department",
			title: "Department (Inline)",
			type: "array",
			of: [{ type: "reference", to: [{ type: "schemaMarkupOrganization" }] }],
		}),
		defineField({
			name: "contactPoint",
			title: "Contact Points",
			type: "array",
			description: "Contact information for the organization",
			of: [
				{
					type: "object",
					fields: [
						defineField({
							name: "contactType",
							title: "Contact Type",
							type: "string",
							description: "e.g., customer service, sales, support",
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: "telephone",
							title: "Telephone",
							type: "string",
							description: "Phone number including country code",
						}),
						defineField({
							name: "email",
							title: "Email",
							type: "string",
							validation: (Rule) => Rule.email(),
						}),
						defineField({
							name: "url",
							title: "Contact URL",
							type: "url",
							description: "URL to contact form or page",
						}),
						defineField({
							name: "areaServed",
							title: "Area Served",
							type: "array",
							of: [{ type: "string" }],
							description: "Geographic areas served (e.g., US, GB, Worldwide)",
							options: { layout: "tags" },
						}),
						defineField({
							name: "availableLanguage",
							title: "Available Languages",
							type: "array",
							of: [{ type: "string" }],
							description: "Languages available for this contact point",
							options: { layout: "tags" },
						}),
					],
					preview: {
						select: {
							contactType: "contactType",
							telephone: "telephone",
							email: "email",
						},
						prepare: ({ contactType, telephone, email }) => ({
							title: contactType || "Contact Point",
							subtitle: telephone || email || "",
						}),
					},
				},
			],
		}),
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
		},
		prepare: ({ refName, inlineName }) => {
			const title = refName || inlineName || "Organization";
			return {
				title,
			};
		},
	},
});
