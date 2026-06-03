import type { UserError } from "../types";

export function mapUserErrors(errors: UserError[] = []): string[] {
	return errors.map((error) => error.message).filter(Boolean);
}

export function formatUserErrors(errors: UserError[] = []): string {
	return mapUserErrors(errors).join(". ");
}

export function hasUserErrors(errors: UserError[] = []): boolean {
	return errors.length > 0;
}
