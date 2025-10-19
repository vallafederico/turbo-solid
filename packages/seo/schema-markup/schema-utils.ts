export function coalesce<T>(
	...values: (T | undefined | null)[]
): T | undefined {
	for (const value of values) {
		if (value !== undefined && value !== null) return value;
	}
	return undefined;
}
