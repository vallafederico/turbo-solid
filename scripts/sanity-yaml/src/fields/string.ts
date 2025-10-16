import type { FieldHandlerParams } from "~/types";

export const handleStringField = ({
	name,
	type,
	options,
}: FieldHandlerParams) => {
	const opts = options
		? options.split(",")?.map((option) => option.trim())
		: null;

	const cleanedName = name?.replace("[]", "");

	const field = {
		name: cleanedName,
		type: "string",
	};

	if (opts) {
		field.options = {
			list: opts,
		};
	}

	if (name === "array") {
		field.name = undefined;
	} // edge case for nested array fields

	return field;
};
