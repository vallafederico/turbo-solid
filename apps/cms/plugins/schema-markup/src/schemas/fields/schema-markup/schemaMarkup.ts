// src/schema/field.ts
import { defineType, defineField } from "sanity";
import { needs } from "../../../utils/needs";
import PageSchemaMarkupInput from "../../../components/core/PageSchemaMarkupInput/PageSchemaMarkupInput";
import ButtonSelector from "../../../../../../components/ButtonSelector";
import {
	MdArticle,
	MdBusiness,
	MdEvent,
	MdPageview,
	MdQuestionAnswer,
	MdShoppingBag,
	MdWeb,
	MdPerson,
	MdStore,
} from "react-icons/md";
import SchemaMarkupTypeSelector from "../../../components/core/PageSchemaMarkupInput/SchemaMarkupTypeSelector";
import { SCHEMA_MARKUP_TYPES } from "../../../globals";

export const schemaMarkup = defineType({
	name: "schemaMarkup",
	title: "Schema Markup",
	components: {
		input: PageSchemaMarkupInput,
	},
	type: "object",
	fields: [
		defineField({
			name: "type",
			title: "Schema Type",
			type: "string",
			components: {
				input: SchemaMarkupTypeSelector,
			},
			options: {
				list: [...Object.values(SCHEMA_MARKUP_TYPES)],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		}),
		// Minimal common fields:
		defineField({
			name: "name",
			type: "string",
			hidden: ({ parent }) => !needs(parent, "name"),
		}),
		defineField({
			name: "description",
			type: "text",
			rows: 3,
			hidden: ({ parent }) => !needs(parent, "description"),
		}),
		defineField({
			name: "inLanguage",
			type: "string",
			hidden: ({ parent }) => !needs(parent, "inLanguage"),
		}),
		// defineField({
		// 	name: "image",
		// 	type: "jsonldImageObject",
		// 	hidden: ({ parent }) => !needs(parent, "image"),
		// }),
		// Type-specific groups (conditionally shown)
		// e.g., Article
		defineField({
			name: "article",
			type: "schemaMarkupArticleFields",
			hidden: ({ parent }) => parent?.type !== "Article",
		}),
		// Product
		defineField({
			name: "product",
			type: "schemaMarkupProductFields",
			hidden: ({ parent }) => parent?.type !== "Product",
		}),
		// ...repeat for Event, FAQPage, BreadcrumbList, etc.
	],
	// components: { input: JsonLdInput }, // custom UI that merges defaults + shows preview
	preview: { select: { title: "type", subtitle: "name" } },
});
