import type { FieldHandlerParams, ProcessedGenericField } from "~/types";
import { handleField } from "../utils/field-handlers";

type ProcessedArrayField = ProcessedGenericField & {
	of: [{ type: string | string }];
};

export const handleArrayField = ({
	name,
	type,
	dataSignature,
	options,
}: FieldHandlerParams): ProcessedArrayField | undefined => {
	const correctedFieldName = name.replace("[]", "");

	return {
		name: correctedFieldName,
		type: "array",
		of: [{ ...handleField(type, dataSignature) }],
	};
};
