const BASE_VALIDATION_RULE = "(Rule: any) => Rule";

const VALIDATION_RULES = {
	required: ".required()",
	max: (max: string | number) => `.max(${max})`,
	email: ".email()",
};

const cleanFieldName = (fieldName: string) => {
	return fieldName.replace(/\d+/, "").replace(/!/, "");
};

export const parseValidationRules = (
	fieldName: string | null,
	fieldType: string | object | null,
) => {
	let validation: null | string = "";

	if (!fieldName) return { validation: null, name: null };

	const limit = fieldName.match(/\d+/)?.[0];
	const required = fieldName.includes("!");
	const isEmailField = fieldType === "email";

	if (limit) validation += VALIDATION_RULES.max(limit);
	if (isEmailField) validation += VALIDATION_RULES.email;
	if (required) validation += VALIDATION_RULES.required;

	if (validation?.length > 1) {
		validation = `${BASE_VALIDATION_RULE}${validation}`;
	} else {
		validation = null;
	}

	return { validation, cleanedFieldName: cleanFieldName(fieldName) };
};
