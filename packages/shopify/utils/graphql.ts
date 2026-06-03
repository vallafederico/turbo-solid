/**
 * Removes duplicate `fragment X on Y { ... }` definitions from a composed query.
 *
 * Fragments embed their own dependencies (e.g. `Money`, `Image`) so they stay
 * reusable in isolation, but composing several of them into one operation can
 * repeat a fragment definition. GraphQL requires fragment names to be unique,
 * so we keep the first occurrence of each and drop the rest.
 */
export function dedupeFragments(query: string): string {
	const fragmentStart = /fragment\s+([A-Za-z0-9_]+)\s+on\s+[A-Za-z0-9_]+\s*\{/g;
	const blocks: { start: number; end: number; name: string }[] = [];

	let match: RegExpExecArray | null;
	while ((match = fragmentStart.exec(query))) {
		const braceStart = query.indexOf("{", match.index);
		let depth = 0;
		let cursor = braceStart;
		for (; cursor < query.length; cursor++) {
			if (query[cursor] === "{") depth++;
			else if (query[cursor] === "}") {
				depth--;
				if (depth === 0) {
					cursor++;
					break;
				}
			}
		}
		blocks.push({ start: match.index, end: cursor, name: match[1] });
	}

	if (!blocks.length) return query;

	const seen = new Set<string>();
	let output = "";
	let cursor = 0;
	for (const block of blocks) {
		output += query.slice(cursor, block.start);
		if (!seen.has(block.name)) {
			output += query.slice(block.start, block.end);
			seen.add(block.name);
		}
		cursor = block.end;
	}
	output += query.slice(cursor);
	return output;
}
