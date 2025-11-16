import type { FieldHandlerParams, ProcessedGenericField } from "~/types";
import { handleField } from "~/utils/field-handlers";

type ProcessedObjectField = ProcessedGenericField & {
	fields: ProcessedGenericField[];
};

export const handleObjectField = ({
	name,
	dataSignature,
}: FieldHandlerParams): ProcessedObjectField => {
	const fieldsArray = Object.entries(dataSignature).map(([key, value]) => {
		return handleField(key, value);
	});

	return {
		name: name === "array" ? undefined : name,
		type: "object",
		fields: fieldsArray,
	};
};
