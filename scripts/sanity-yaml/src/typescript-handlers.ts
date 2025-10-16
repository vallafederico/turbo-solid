const TYPE_TRANSFORMERS = {
	datetime: "String",
	date: "String",
	url: "String",
	email: "String",
	string: ({ options }) => {
		if (Array.isArray(options?.list)) {
			return `'${options.list.map((option) => `'${option}'`).join(" | ")}'`;
		}
		return "String";
	},
	reference: "any",
};

export const fieldToTypeDefinition = (field: any) => {
	const typeTransformer = TYPE_TRANSFORMERS[field.type];
	const definition =
		typeof typeTransformer === "function"
			? typeTransformer(field?.type)
			: typeTransformer || field.type;

	return definition;
};
