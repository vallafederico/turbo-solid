import { BASE_VALIDATION_RULE } from "../globals";

const cleanFieldName = (fieldName: string) => {
	return fieldName.replace(/\d+/, "").replace(/!/, "");
};

export const parseValidationRules = (
	fieldName: string,
	fieldType: string | object | null,
) => {
	let validation: null | string = "";

	const limit = fieldName.match(/\d+/)?.[0];
	const required = fieldName.includes("!");
	const isEmailField = fieldType === "email";

	if (limit) validation += `.max(${limit})`;
	if (isEmailField) validation += ".email()";
	if (required) validation += ".required()";

	if (validation?.length > 1) {
		validation = `${BASE_VALIDATION_RULE}${validation}`;
	} else {
		validation = null;
	}

	return { validation, name: cleanFieldName(fieldName) };
};
