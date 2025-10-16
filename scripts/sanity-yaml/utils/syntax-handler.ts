import type { VALIDATION_RULES } from "../globals";
import { parseValidationRules } from "./validation";

interface SyntaxHandlerReturn {
	_type: string;
	validation: (typeof VALIDATION_RULES)[keyof typeof VALIDATION_RULES] | null;
	reference: string | null;
}

export const handleSyntax = (
	fieldName: string,
	fieldDefinition: string | object,
) => {
	const FIELD: SyntaxHandlerReturn = {
		_type: "unknown",
		validation: null,
		reference: null,
	};

	const isSimpleField = typeof fieldDefinition === "string";

	if (isSimpleField) {
		const validation = parseValidationRules(fieldName, fieldDefinition);
		FIELD.validation = validation;

		if (fieldDefinition.includes("[]")) {
			FIELD._type = "array";
			FIELD.reference = fieldDefinition.split("[]")[1];
		}

		if (fieldDefinition.includes("->")) {
			FIELD._type = FIELD._type ? FIELD._type : "reference";
			FIELD.reference = fieldDefinition.split("->")[1];
		}
	}
};
