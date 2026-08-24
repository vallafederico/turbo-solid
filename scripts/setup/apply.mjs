// @ts-check
/**
 * Apply a cleanup plan from model.mjs. Zero deps; safe to run before install.
 */

import { existsSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { ok, warn } from "./prompts.mjs";

const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];

export function readJson(path) {
	const raw = readFileSync(path, "utf8");
	const indentMatch = raw.match(/^[ \t]*(\t|  +)/m);
	const indent = indentMatch ? indentMatch[1] : "  ";
	return { data: JSON.parse(raw), indent, trailingNewline: raw.endsWith("\n") };
}

export function writeJson(path, data, indent, trailingNewline) {
	let out = JSON.stringify(data, null, indent);
	if (trailingNewline) out += "\n";
	writeFileSync(path, out);
}

function escapeRe(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function skipString(src, i) {
	const q = src[i];
	i += 1;
	while (i < src.length) {
		if (src[i] === "\\") {
			i += 2;
			continue;
		}
		if (src[i] === q) return i + 1;
		i += 1;
	}
	return i;
}

/**
 * Remove `const Name = ...;` including multiline calls.
 * @param {string} src
 * @param {string} name
 */
export function removeConstDecl(src, name) {
	const re = new RegExp(`(?:export\\s+)?const\\s+${escapeRe(name)}\\s*=`);
	const m = re.exec(src);
	if (!m) return src;
	let from = m.index;
	while (from > 0 && (src[from - 1] === " " || src[from - 1] === "\t")) from -= 1;
	if (src[from - 1] === "\n") from -= 1;

	let i = m.index + m[0].length;
	let depth = 0;
	while (i < src.length) {
		const ch = src[i];
		if (ch === '"' || ch === "'" || ch === "`") {
			i = skipString(src, i);
			continue;
		}
		if (ch === "(" || ch === "{" || ch === "[") {
			depth += 1;
			i += 1;
			continue;
		}
		if (ch === ")" || ch === "}" || ch === "]") {
			depth -= 1;
			i += 1;
			continue;
		}
		if (ch === ";" && depth === 0) {
			i += 1;
			break;
		}
		i += 1;
	}
	return src.slice(0, from) + src.slice(i);
}

/**
 * Remove every `<Tag ... />` or `<Tag>...</Tag>`, respecting `{...}` in props.
 * @param {string} src
 * @param {string} tag
 */
export function removeJsxTag(src, tag) {
	let out = src;
	const startRe = new RegExp(`\\s*<${escapeRe(tag)}(?=[\\s>/])`);
	while (true) {
		const m = startRe.exec(out);
		if (!m) break;
		const start = m.index;
		const tagStart = out.indexOf(`<${tag}`, start);
		let i = tagStart;
		let depth = 0;
		let end = -1;
		while (i < out.length) {
			const ch = out[i];
			if (ch === '"' || ch === "'" || ch === "`") {
				i = skipString(out, i);
				continue;
			}
			if (ch === "{") {
				depth += 1;
				i += 1;
				continue;
			}
			if (ch === "}") {
				depth -= 1;
				i += 1;
				continue;
			}
			if (depth === 0 && out.startsWith("/>", i)) {
				end = i + 2;
				break;
			}
			if (depth === 0 && ch === ">") {
				const close = out.indexOf(`</${tag}>`, i);
				end = close >= 0 ? close + `</${tag}>`.length : i + 1;
				break;
			}
			i += 1;
		}
		if (end < 0) break;
		out = out.slice(0, start) + out.slice(end);
	}
	return out;
}

export function removeRobotsLink(src) {
	return src.replace(/\n\s*<Link\s+rel="robots"[\s\S]*?\/>/, "");
}

/**
 * Drop imported bindings that no longer appear in the file.
 * @param {string} src
 */
export function sweepUnusedImports(src) {
	const importRe =
		/^import\s+(?:type\s+)?(?:(\w+)(?:\s*,\s*)?)?(?:\*\s+as\s+(\w+))?(?:\{([^}]*)\})?\s+from\s+['"][^'"]+['"];?[ \t]*\n?/gm;

	/** @type {{ start: number, end: number, text: string, defaults: string[], names: { raw: string, local: string }[], star: string | null, from: string }[]} */
	const blocks = [];
	let m;
	const fromRe = /from\s+['"]([^'"]+)['"]/;
	while ((m = importRe.exec(src))) {
		const text = m[0];
		if (text.includes("(")) continue;
		const from = fromRe.exec(text)?.[1] ?? "";
		const names = (m[3] ?? "")
			.split(",")
			.map((part) => part.trim())
			.filter(Boolean)
			.map((raw) => {
				const cleaned = raw.replace(/^type\s+/, "");
				const [left, right] = cleaned.split(/\s+as\s+/);
				return { raw, local: (right ?? left).trim() };
			});
		blocks.push({
			start: m.index,
			end: m.index + text.length,
			text,
			defaults: m[1] ? [m[1]] : [],
			names,
			star: m[2] ?? null,
			from,
		});
	}

	let out = src;
	for (const block of [...blocks].reverse()) {
		const rest = out.slice(0, block.start) + out.slice(block.end);
		const keepDefault = block.defaults.filter((name) => identUsed(rest, name));
		const keepStar = block.star && identUsed(rest, block.star) ? block.star : null;
		const keepNames = block.names.filter((item) => identUsed(rest, item.local));

		if (!keepDefault.length && !keepStar && !keepNames.length) {
			out = out.slice(0, block.start) + out.slice(block.end);
			continue;
		}

		const typeOnly = block.text.startsWith("import type");
		let next = typeOnly ? "import type " : "import ";
		if (keepDefault.length) next += keepDefault[0];
		if (keepStar) next += `${keepDefault.length ? ", " : ""}* as ${keepStar}`;
		if (keepNames.length) {
			if (keepDefault.length || keepStar) next += ", ";
			next += `{ ${keepNames.map((item) => item.raw).join(", ")} }`;
		}
		next += ` from "${block.from}";\n`;
		out = out.slice(0, block.start) + next + out.slice(block.end);
	}
	return out.replace(/\n{3,}/g, "\n\n");
}

function identUsed(src, name) {
	if (!name) return false;
	const re = new RegExp(`\\b${escapeRe(name)}\\b`);
	return re.test(src);
}

export function removeNavLink(src, href) {
	const re = new RegExp(
		`\\{\\s*(?:to|href):\\s*["']${escapeRe(href)}["']\\s*,\\s*text:\\s*["'][^"']*["']\\s*\\},?\\s*`,
		"g",
	);
	return src.replace(re, "").replace(/,(\s*\])/g, "$1");
}

export function emptyTranspilePackages(src) {
	return src.replace(/transpilePackages:\s*\[[^\]]*\]/, "transpilePackages: []");
}

export function removeLineIncludes(src, needles) {
	const lines = src.split("\n");
	const kept = lines.filter((line) => !needles.some((needle) => line.includes(needle)));
	return kept.join("\n").replace(/\n{3,}/g, "\n\n");
}

export function stripShopifyConfig(src) {
	let out = src;
	out = out.replace(/\n\s*ignore:\s*\[[^\]]*["']\/_\/shop[^]*?\],?/, "");
	out = removeObjectProp(out, "/_/shop");
	out = removeObjectProp(out, "/_/shop/**");
	out = removeObjectProp(out, "/api/shopify/revalidate");
	out = out.replace(/\n\s*routeRules:\s*\{\s*\},?/, "");
	return out;
}

function removeObjectProp(src, key) {
	const patterns = [`"${key}":`, `'${key}':`];
	let out = src;
	for (const token of patterns) {
		let idx = out.indexOf(token);
		while (idx >= 0) {
			let start = idx;
			while (start > 0 && /[ \t]/.test(out[start - 1])) start -= 1;
			if (out[start - 1] === "\n") start -= 1;

			let i = idx + token.length;
			while (i < out.length && /\s/.test(out[i])) i += 1;
			if (out[i] !== "{") {
				idx = out.indexOf(token, idx + token.length);
				continue;
			}
			let depth = 0;
			while (i < out.length) {
				const ch = out[i];
				if (ch === '"' || ch === "'" || ch === "`") {
					i = skipString(out, i);
					continue;
				}
				if (ch === "{") {
					depth += 1;
					i += 1;
					continue;
				}
				if (ch === "}") {
					depth -= 1;
					i += 1;
					if (depth === 0) break;
					continue;
				}
				i += 1;
			}
			if (out[i] === ",") i += 1;
			out = out.slice(0, start) + out.slice(i);
			idx = out.indexOf(token);
		}
	}
	return out;
}

function applyPatches(src, patches) {
	let out = src;
	for (const patch of patches) {
		if (patch.type === "remove-const") out = removeConstDecl(out, patch.name);
		else if (patch.type === "remove-jsx") out = removeJsxTag(out, patch.tag);
		else if (patch.type === "remove-robots-link") out = removeRobotsLink(out);
		else if (patch.type === "sweep-imports") out = sweepUnusedImports(out);
		else if (patch.type === "empty-transpile-packages") out = emptyTranspilePackages(out);
		else if (patch.type === "remove-line-includes") out = removeLineIncludes(out, patch.needles);
		else if (patch.type === "strip-shopify-config") out = stripShopifyConfig(out);
		else warn(`Unknown patch type: ${patch.type}`);
	}
	return out;
}

function scanWorkspace(root) {
	const dirToName = new Map();
	for (const group of ["apps", "packages", "scripts"]) {
		const groupDir = join(root, group);
		if (!existsSync(groupDir)) continue;
		for (const entry of readdirSync(groupDir)) {
			const rel = `${group}/${entry}`;
			const pkgPath = join(root, rel, "package.json");
			if (!existsSync(pkgPath)) continue;
			try {
				const { data } = readJson(pkgPath);
				if (data.name) dirToName.set(rel, data.name);
			} catch {
				/* ignore */
			}
		}
	}
	return dirToName;
}

function pruneWorkspaceDeps(root, removedNames, dryRun) {
	const dirToName = scanWorkspace(root);
	for (const [rel] of dirToName) {
		const pkgPath = join(root, rel, "package.json");
		const { data, indent, trailingNewline } = readJson(pkgPath);
		let changed = false;
		for (const field of DEP_FIELDS) {
			if (!data[field]) continue;
			for (const dep of Object.keys(data[field])) {
				if (removedNames.has(dep)) {
					delete data[field][dep];
					changed = true;
				}
			}
			if (data[field] && Object.keys(data[field]).length === 0) delete data[field];
		}
		if (changed) {
			if (!dryRun) writeJson(pkgPath, data, indent, trailingNewline);
			ok(`cleaned ${rel}/package.json`);
		}
	}

	const rootPkg = join(root, "package.json");
	if (!existsSync(rootPkg)) return;
	const { data, indent, trailingNewline } = readJson(rootPkg);
	let changed = false;
	for (const field of DEP_FIELDS) {
		if (!data[field]) continue;
		for (const dep of Object.keys(data[field])) {
			if (removedNames.has(dep)) {
				delete data[field][dep];
				changed = true;
			}
		}
	}
	if (changed) {
		if (!dryRun) writeJson(rootPkg, data, indent, trailingNewline);
		ok("cleaned root package.json workspace deps");
	}
}

function pruneRootScripts(root, keepKeys, dryRun) {
	const pkgPath = join(root, "package.json");
	const { data, indent, trailingNewline } = readJson(pkgPath);
	if (!data.scripts) return;
	const keep = new Set(keepKeys);
	const removed = [];
	for (const key of Object.keys(data.scripts)) {
		if (!keep.has(key) && /^(dev:|build:web$|web$|optimise$)/.test(key)) {
			delete data.scripts[key];
			removed.push(key);
		}
	}
	if (removed.length) {
		if (!dryRun) writeJson(pkgPath, data, indent, trailingNewline);
		ok(`removed root scripts: ${removed.join(", ")}`);
	}
}

function removePackageDeps(root, pkg, names, dryRun) {
	const pkgPath = join(root, pkg, "package.json");
	if (!existsSync(pkgPath)) return;
	const { data, indent, trailingNewline } = readJson(pkgPath);
	let changed = false;
	for (const field of DEP_FIELDS) {
		if (!data[field]) continue;
		for (const name of names) {
			if (name in data[field]) {
				delete data[field][name];
				changed = true;
			}
		}
		if (data[field] && Object.keys(data[field]).length === 0) delete data[field];
	}
	if (changed) {
		if (!dryRun) writeJson(pkgPath, data, indent, trailingNewline);
		ok(`removed deps from ${pkg}: ${names.join(", ")}`);
	}
}

export function scanDanglingImports(root, keepDirs, removedNames) {
	if (!removedNames.size) return [];
	const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".astro"]);
	const results = [];
	const patterns = [...removedNames].map((name) => ({
		name,
		re: new RegExp(`(?:from|import|require\\()\\s*['"]${escapeRe(name)}(?:/[^'"]*)?['"]`),
	}));

	const walk = (absDir, relDir) => {
		let entries;
		try {
			entries = readdirSync(absDir);
		} catch {
			return;
		}
		for (const entry of entries) {
			if (entry === "node_modules" || entry === ".turbo" || entry === "dist" || entry === ".output" || entry.startsWith(".")) {
				continue;
			}
			const abs = join(absDir, entry);
			const rel = `${relDir}/${entry}`;
			let st;
			try {
				st = statSync(abs);
			} catch {
				continue;
			}
			if (st.isDirectory()) walk(abs, rel);
			else if (exts.has(entry.slice(entry.lastIndexOf(".")))) {
				let content;
				try {
					content = readFileSync(abs, "utf8");
				} catch {
					continue;
				}
				for (const { name, re } of patterns) {
					if (re.test(content)) {
						results.push(`${rel}  (imports ${name})`);
						break;
					}
				}
			}
		}
	};

	for (const rel of keepDirs) {
		const abs = join(root, rel);
		if (existsSync(abs)) walk(abs, rel);
	}
	return results;
}

/**
 * @param {string} root
 * @param {{ keep: string[], ops: object[] }} plan
 * @param {{ dryRun?: boolean }} [opts]
 */
export function applyPlan(root, plan, opts = {}) {
	const dryRun = Boolean(opts.dryRun);
	const dirToName = scanWorkspace(root);
	const removedNames = new Set();
	for (const op of plan.ops) {
		if (op.type === "delete" && dirToName.has(op.path)) {
			removedNames.add(dirToName.get(op.path));
		}
	}

	for (const op of plan.ops) {
		if (op.type === "delete") {
			if (!existsSync(join(root, op.path))) continue;
			if (!dryRun) rmSync(join(root, op.path), { recursive: true, force: true });
			ok(`removed ${op.path}`);
		} else if (op.type === "write-file") {
			const abs = join(root, op.path);
			if (!dryRun) {
				mkdirSync(dirname(abs), { recursive: true });
				writeFileSync(abs, op.contents);
			}
			ok(`wrote ${op.path}`);
		} else if (op.type === "patch-file") {
			const abs = join(root, op.path);
			if (!existsSync(abs)) {
				warn(`skip patch, missing ${op.path}`);
				continue;
			}
			const next = applyPatches(readFileSync(abs, "utf8"), op.patches);
			if (!dryRun) writeFileSync(abs, next);
			ok(`patched ${op.path}`);
		} else if (op.type === "remove-nav-link") {
			const abs = join(root, op.path);
			if (!existsSync(abs)) continue;
			const next = removeNavLink(readFileSync(abs, "utf8"), op.href);
			if (!dryRun) writeFileSync(abs, next);
			ok(`removed nav link ${op.href} from ${op.path}`);
		} else if (op.type === "remove-package-deps") {
			removePackageDeps(root, op.pkg, op.names, dryRun);
		} else if (op.type === "prune-workspace-deps") {
			pruneWorkspaceDeps(root, removedNames, dryRun);
		} else if (op.type === "prune-root-scripts") {
			pruneRootScripts(root, op.keepKeys, dryRun);
		} else if (op.type === "write-starter") {
			if (!dryRun) writeJson(join(root, ".starter.json"), op.contents, "\t", true);
			ok("wrote .starter.json");
		}
	}

	const dangling = dryRun
		? []
		: scanDanglingImports(root, plan.keep, removedNames);

	return { removedNames: [...removedNames], dangling };
}
