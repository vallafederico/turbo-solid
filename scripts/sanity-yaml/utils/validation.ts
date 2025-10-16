import { BASE_VALIDATION_RULE } from "../globals";

export const parseValidationRules = (
	fieldName: string,
	fieldType: string | object | null,
) => {
	let validation: null | string = "";

	const hasNumeric = typeof fieldName.match(/d+/)?.[0] === "number";
	const hasRequired = fieldName.includes("!");
	const isEmailField = fieldType === "email";

	if (hasNumeric) {
		validation += `.max(${fieldName.match(/d+/)?.[0]})`;
	}

	if (isEmailField) {
		validation += ".email()";
	}

	if (hasRequired) {
		validation += ".required()";
	}

	if (validation?.length > 1) {
		validation = `${BASE_VALIDATION_RULE}${validation}`;
	} else {
		validation = null;
	}

	return validation;
};
