import { FilesetDataOutput } from "~/types";

export const FIELDS_MAP = {
	string: "string",
	url: "url",
	number: "number",
	email: {
		type: "string",
		validation: "Rule",
	},
	boolean: "boolean",
	datetime: "datetime",
	date: "date",
	// array: handleArrayField,
	// object: handleObjectField,
	reference: "reference",
	image: "image",
	file: "file",
};

export type GeneratorConfig = {
	fieldDefaults?: {
		text: {
			rows: number;
		};
	};
	additionalTypes?: {
		[key: string]: string;
	};

	filesets: {
		[name: string]: {
			output: string;
			input: string;
			template: string;
			data: FilesetDataOutput;
		};
	};
};

export const CONFIG: GeneratorConfig = {
	fieldDefaults: {
		text: {
			rows: 3,
		},
	},

	typescript: {
		// useTypeInstead: false, // if true, use type instead of interface in type definitions
		removeAppendedName: false,
	},

	filesets: {
		schemas: {
			output: "/",
			input: "slices.yaml",
			template: "templates/sanity-slice.hbs",
			data: "schema",
		},
		// types: {
		// 	output: "/dist/types",
		// 	input: "slices.yaml",
		// 	template: "sanity-",
		// 	data: "type",
		// },
	},

	// additionalTypes: {
	// 	link: "link",
	// },
};
