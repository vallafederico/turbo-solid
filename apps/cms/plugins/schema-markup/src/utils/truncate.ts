export function truncate(text: string | undefined, len: number) {
	if (!text) return "";
	if (text.length <= len) return text;
	let out = text.slice(0, len);
	const lastSpace = out.lastIndexOf(" ");
	if (lastSpace > 40) out = out.slice(0, lastSpace);
	return `${out}…`;
}
