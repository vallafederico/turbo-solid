import type { FieldHandlerReturn } from "../types";

const TYPE_TRANSFORMERS: Record<
	string,
	string | ((args: FieldHandlerReturn) => string)
> = {
	datetime: "String",
	date: "String",
	url: "String",
	text: "String",
	email: "String",
	string: ({ options }) => {
		if (Array.isArray(options)) {
			return options.map((option) => `'${option}'`).join(" | ");
		}
		return "String";
	},
	number: "Number",
	boolean: "Boolean",
	reference: "any",
	array: "Array",
};

export const fieldToTypeDefinition = (field: FieldHandlerReturn) => {
	const typeTransformer = TYPE_TRANSFORMERS?.[field?.type];
	const definition =
		typeof typeTransformer === "function"
			? typeTransformer(field)
			: typeTransformer || field.type;

	return definition;
};
