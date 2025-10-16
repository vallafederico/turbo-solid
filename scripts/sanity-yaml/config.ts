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

type Config = {
	slices: {
		schemaTemplate: string;
		frontendTemplate: string;
		componentPath?: string;
		typedValidationRules?: boolean;
		fieldDefaults?: {
			text: {
				rows: number;
			};
		};
	};
	pages: {
		schemaPath: string;
		componentPath?: string;
	};
	additionalTypes?: {
		[key: string]: string;
	};
	templatePaths?: {
		frontend: "";
		sanityObjectField: "";
		sanitySimpleField: "";
	};
};

export const CONFIG: Config = {
	slices: {
		// schemaPath: "/templates/sanity-slice.hbs",
		schemaTemplate: "./templates/sanity-slice.hbs",
		frontendTemplate: "./templates/frontend-slice.hbs",
		componentPath: "",
		// typedValidationRules: true,
		fieldDefaults: {
			text: {
				rows: 3,
			},
		},
	},
	pages: {
		schemaPath: "",
		componentPath: "",
	},
	additionalTypes: {
		link: "link",
	},
};
