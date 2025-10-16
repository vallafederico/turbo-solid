import { fieldToTypeDefinition } from "../src/typescript-handlers";
import { parseValidationRules } from "./validation";

const handleArrayField = (name: string, type: string, dataSignature: any) => {
	return {
		name: name.replace("[]", ""),
		type: "array",
		of: [{ type: dataSignature }],
	};
};

const handleStringField = (name: string, type: string, isArray: boolean) => {
	const hasOptions = type.match(/string\(.*\)/)?.[0];
	const options = hasOptions
		? type
				.split("(")[1]
				.split(")")[0]
				.split(",")
				?.map((option) => option.trim())
		: null;

	const field = {
		name: name.replace("[]", ""),
		type: "string",
	};

	if (options) {
		field.options = {
			list: options,
		};
	}

	if (isArray) {
		return {
			...field,
			type: "array",
			of: [{ type: "string" }],
		};
	}

	return field;
};

const handleGeneric = (name: string, type: string) => {
	return {
		name,
		type,
	};
};

const handleObjectField = (
	name: string,
	type: string,
	fieldData: Record<string, string>,
) => {
	const fieldsArray = Object.entries(fieldData).map(([key, value]) => {
		return handleField(key, value);
	});

	return {
		name,
		type: "object",
		fields: fieldsArray,
	};
};

const handleTextField = (name: string, type: string) => {
	return {
		name,
		type: "text",
	};
};

const handleReferenceField = (name: string, type: string, data: any) => {
	const isArray = name.includes("[]");

	if (isArray) {
		return {
			name: name.replace("[]", ""),
			type: "array",
			of: [{ type: "reference", to: [{ type: data }] }],
		};
	}

	return {
		name: name,
		type: "reference",
		of: [{ type: data }],
	};
};

const GENERIC_FIELD_TYPES = [
	"datetime",
	"date",
	"number",
	"boolean",
	"geopoint",
	"slug",
];

const FIELD_HANDLERS = {
	string: handleStringField,
	object: handleObjectField,
	array: handleArrayField,
	email: handleStringField,
	text: handleTextField,
	reference: handleReferenceField,
	...GENERIC_FIELD_TYPES.reduce((acc, type) => {
		acc[type] = handleGeneric;
		return acc;
	}, {}),
};

const reconcileFieldType = (name: string, type: string) => {
	const field = {
		_type: type,
		dataSignature: null,
	};

	if (Array.isArray(type)) {
		field._type = "array";
		field.dataSignature = type;

		return field;
	}

	if (typeof type === "string" && type?.startsWith("->")) {
		field._type = "reference";
		field.dataSignature = type.replace("->", "");
		return field;
	}

	if (typeof type === "object") {
		// console.log("object field::", type);
		field._type = "object";
		field.dataSignature = type;

		return field;
	}

	if (typeof type === "string" && name.includes("[]")) {
		field._type = "array";
		field.dataSignature = type.split("[]")[0].trim();

		return field;
	}

	if (type?.startsWith("string")) {
		field._type = "string";

		return field;
	}

	return field;
};

export const handleField = (name: string, type: any) => {
	const { _type, dataSignature } = reconcileFieldType(name, type);
	const { validation, name: fieldName } = parseValidationRules(name, type);

	const fn = FIELD_HANDLERS?.[_type];

	if (typeof fn !== "function") {
		console.log("🚨 No field handler or declared type found for type: ", type);
		return undefined;
	}

	const formattedField = fn(fieldName, _type, dataSignature);

	const f = {
		field: formattedField,
		typeDefinition: fieldToTypeDefinition(formattedField),
		validation,
	};

	return f;
};
