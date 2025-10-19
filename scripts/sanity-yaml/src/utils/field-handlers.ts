import {
	handleArrayField,
	handleObjectField,
	handleGeneric,
	handleReferenceField,
	handleStringField,
	handleTextField,
	handleSlugField,
} from "~/fields";
import { handleFileField } from "~/fields/file";
import type { FieldHandlerReturn } from "~/types";
import { fieldToTypeDefinition } from "~/typegen";
import { parseValidationRules } from "~/validation";

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
	slug: handleSlugField,
	reference: handleReferenceField,
	file: handleFileField,
	...GENERIC_FIELD_TYPES.reduce((acc, type) => {
		acc[type] = handleGeneric;
		return acc;
	}, {}),
};

const parseFieldData = (name: string | null, type: string) => {
	const options = typeof type === "string" ? type.match(/\((.*)\)/)?.[1] : null;
	const cleanedTypeName =
		typeof type === "string" ? type.replace(/\((.*)\)/, "") : type;

	const field = {
		_type: cleanedTypeName,
		dataSignature: null,
		options,
	};

	if (Array.isArray(type)) {
		field._type = "array";
		field.dataSignature = cleanedTypeName;

		return field;
	}

	if (typeof type === "string" && type?.startsWith("->")) {
		field._type = "reference";
		field.dataSignature = type.replace("->", "");
		return field;
	}

	if (typeof name === "string" && name?.includes("[]")) {
		field._type = "array";
		field.dataSignature = cleanedTypeName;

		return field;
	}

	if (typeof type === "object") {
		field._type = "object";
		field.dataSignature = cleanedTypeName;

		return field;
	}

	if (cleanedTypeName === "file") {
		field._type = "file";
		field.dataSignature = cleanedTypeName;

		return field;
	}

	if (cleanedTypeName === "text") {
		field._type = "text";

		return field;
	}

	if (cleanedTypeName === "string") {
		field._type = "string";

		return field;
	}

	return field;
};

export const coalesce = (objKey: string, options: object | string | null) => {
	const fieldOptions = {} as Record<string, string>;

	if (!options) return {};

	if (typeof options === "string") {
		return { [objKey]: options };
	}

	for (const [key, value] of Object.entries(options)) {
		if (value !== undefined) {
			fieldOptions[key] = value as string;
		}
	}

	if (Object.keys(fieldOptions).length === 0) {
		return {};
	}

	return { [objKey]: fieldOptions };
};

export const handleField = (
	name: string | null,
	type: unknown,
): FieldHandlerReturn | undefined => {
	// console.log("handling field::", name, type);
	if (!type) {
		console.log("🚨 No field type");
		return undefined;
	}

	if (name === "undefined") {
		return undefined;
	}

	const { _type, dataSignature, options } = parseFieldData(name, type);
	const { validation, cleanedFieldName } = parseValidationRules(name, type);

	const fn = FIELD_HANDLERS?.[_type];

	if (typeof fn !== "function") {
		console.log("🚨 No field handler or declared type found for type: ", type);
		return undefined;
	}

	const formattedField = fn({
		name: cleanedFieldName,
		type: _type,
		dataSignature,
		options,
	});

	return {
		...formattedField,
		...coalesce("validation", validation),
		_PARAMS: {
			type: fieldToTypeDefinition(formattedField),
		},
	};
};
