export const randomItem = <T>(array: T[]) =>
	array[Math.floor(Math.random() * array.length)];
