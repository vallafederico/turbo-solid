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
