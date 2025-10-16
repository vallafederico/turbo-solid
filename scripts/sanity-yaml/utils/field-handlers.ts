import { fieldToTypeDefinition } from "./generators";

const handleArrayField = (name: string, fieldData: { type: string }) => {
	return {
		name,
		type: "array",
		of: [{ type: fieldData.type }],
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
		name,
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
	fieldData: { fields: { name: string; type: string }[] },
) => {
	const fieldsArray = Object.entries(fieldData).map(([key, value]) => ({
		name: key,
		type: value,
	}));

	return {
		name,
		type: "object",
		fields: fieldsArray,
	};
};

const FIELD_HANDLERS = {
	string: handleStringField,
	datetime: handleGeneric,
	date: handleGeneric,
	number: handleGeneric,
	boolean: handleGeneric,
	object: handleObjectField,
	array: handleArrayField,
};

const reconcileFieldType = (type: string) => {
	if (typeof type === "object") {
		return "object";
	}

	if (type.includes("[]")) {
		return "array";
	}

	if (type?.includes("string")) {
		return "string";
	}

	return type;
};

export const handleField = (name: string, type: string) => {
	// console.log(type);
	const _type = reconcileFieldType(type);
	const fn = FIELD_HANDLERS?.[_type];

	if (typeof fn !== "function") {
		console.log("🚨 No field handler or declared type found for type: ", type);
		return undefined;
	}

	const formattedField = fn(name, _type);

	return {
		field: formattedField,
		typeDefinition: fieldToTypeDefinition(formattedField),
	};
};
