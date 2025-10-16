export const BASE_VALIDATION_RULE = "(r: any)=>Rule";

export const VALIDATION_RULES = {
	required: ".required()",
	max: (max: number | null) => `.max(${max})`,
	email: ".email()",
};
