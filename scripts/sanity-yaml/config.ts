export const fieldTypeMap = {
	string: "string",
	url: "url",
	number: "number",
	email: {
		type: "string",
		validation: "email",
	},
	boolean: "boolean",
	datetime: "datetime",
	date: "date",
	array: "array",
	object: "object",
	reference: "reference",
	image: "image",
	file: "file",
};

const CONFIG = {
	slices: {
		schemaPath: "",
		componentPath: "",
	},
	pages: {
		schemaPath: "",
		componentPath: "",
	},
	additionalTypes: {
		link: "link",
	},
};
