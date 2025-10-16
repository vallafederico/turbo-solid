import { EXTENSION_TO_MIME } from "./mime-types";
import type { FieldHandlerParams } from "~/types";

export const handleFileField = ({
	name,
	type,
	dataSignature,
	options,
}: FieldHandlerParams) => {
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
