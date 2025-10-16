import type { FieldHandlerParams } from "~/types";
import { handleField } from "../utils/field-handlers";

export const handleArrayField = ({
	name,
	type,
	dataSignature,
	options,
}: FieldHandlerParams) => {
	const correctedFieldName = name.replace("[]", "");

	const field = {
		name: correctedFieldName,
		type: "array",
		of: [{ ...handleField(type, dataSignature) }],
	};

	return field;
};
