export const disableArgTypes = (...argTypes: string[]) => {
	return argTypes.reduce(
		(acc, key) => {
			acc[key] = { table: { disable: true } };
			return acc;
		},
		{} as Record<string, any>,
	);
};
