export const parseMetafieldOptions = (options: string) => {
	return typeof options === 'string' ? JSON.parse(options) : options
}

export const normalizeString = (str: string | undefined) => {
	if (!str) return undefined
	return str.trim().toLowerCase()
}
