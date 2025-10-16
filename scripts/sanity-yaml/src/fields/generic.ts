import type { FieldHandlerParams, ProcessedGenericField } from "~/types";

export const handleGeneric = ({
	name,
	type,
}: FieldHandlerParams): ProcessedGenericField => {
	return {
		name,
		type,
	};
};
