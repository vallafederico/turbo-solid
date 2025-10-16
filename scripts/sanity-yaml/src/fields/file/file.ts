import { EXTENSION_TO_MIME } from "./mime-types";
import type { FieldHandlerParams, ProcessedGenericField } from "~/types";

export interface ProcessedFileField extends ProcessedGenericField {
	options?: {
		accepts: string[];
	};
}

export const handleFileField = ({
	name,
	options,
}: FieldHandlerParams): ProcessedFileField => {
	let accepts: string[] | undefined;

	if (options) {
		const extensions = options
			.split(",")
			.map((ext) => ext.trim().toLowerCase())
			.filter(Boolean);

		accepts = extensions
			.map((ext) => EXTENSION_TO_MIME[ext] || ext)
			.filter(Boolean);
	}

	return {
		name,
		type: "file",
		options: accepts ? { accepts } : undefined,
	};
};
