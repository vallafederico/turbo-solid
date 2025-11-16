import type { FieldHandlerParams } from "~/types";

export const handleReferenceField = ({
	name,
	dataSignature,
	options,
}: FieldHandlerParams) => {
	const isArray = name.includes("[]");
	const formattedOptions = options
		? options.split(",").map((option) => option.trim())
		: null;

	const referenceTo = formattedOptions
		? formattedOptions.map((option) => ({ type: option }))
		: [{ type: dataSignature }];

	if (isArray) {
		return {
			name: name.replace("[]", ""),
			type: "array",
			of: [{ type: "reference", to: referenceTo }],
		};
	}

	return {
		name: name,
		type: "reference",
		of: referenceTo,
	};
};
