import type { FieldHandlerParams } from "~/types";
import { handleField } from "~/utils/field-handlers";

export const handleObjectField = ({
	name,
	type,
	dataSignature,
}: FieldHandlerParams) => {
	const fieldsArray = Object.entries(dataSignature).map(([key, value]) => {
		return handleField(key, value);
	});

	return {
		name,
		type: "object",
		fields: fieldsArray,
	};
};
