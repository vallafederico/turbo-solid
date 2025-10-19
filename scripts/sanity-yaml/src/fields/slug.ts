import type { FieldHandlerParams } from "~/types";
import { coalesce } from "~/utils/field-handlers";

export const handleSlugField = ({ name, options }: FieldHandlerParams) => {
	return {
		name,
		type: "slug",
		...coalesce("options", {
			source: options,
		}),
	};
};
