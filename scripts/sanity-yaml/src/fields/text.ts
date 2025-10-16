import type { FieldHandlerParams } from "~/types";
import { CONFIG } from "../../config";

export const handleTextField = ({ name, options }: FieldHandlerParams) => {
	const rows = options || CONFIG.fieldDefaults?.text?.rows;

	return {
		name,
		type: "text",
		options: {
			rows,
		},
	};
};
