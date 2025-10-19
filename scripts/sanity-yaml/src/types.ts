export type FilesetDataOutput = "schema" | "type";

type SanityFieldType =
	| "string"
	| "number"
	| "boolean"
	| "array"
	| "object"
	| "reference"
	| "file"
	| "image"
	| "datetime"
	| "date"
	| "geopoint"
	| "slug"
	| "email"
	| "text";

export type ExtraFieldParams = {
	_PARAMS: {
		type: string;
		validation?: string;
	};
	options?: {
		[key: string]: string;
	};
};

export type TemplateData = {
	name: string;
	title: string;
	fields: Record<string, string>;
};

export type FieldHandlerParams = {
	name: string;
	type: string;
	dataSignature: string;
	options: string;
};

export type ProcessedGenericField = {
	name?: string;
	type: SanityFieldType | string;
	validation?: string;
};

export type FieldHandlerReturn = ProcessedGenericField & ExtraFieldParams;
