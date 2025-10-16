const TYPE_TRANSFORMERS = {
	datetime: "String",
	date: "String",
	url: "String",
	text: "String",
	email: "String",
	string: ({ options }) => {
		if (Array.isArray(options?.list)) {
			return `'${options.list.map((option) => `'${option}'`).join(" | ")}'`;
		}
		return "String";
	},
	number: "Number",
	boolean: "Boolean",
	reference: "any",
	array: (data) => {
		return "Array";
	},
};

export const fieldToTypeDefinition = (field: any) => {
	if (!field?.type) {
		return undefined;
	}

	const typeTransformer = TYPE_TRANSFORMERS?.[field?.type];
	const definition =
		typeof typeTransformer === "function"
			? typeTransformer(field?.type)
			: typeTransformer || field.type;

	return definition;
};
