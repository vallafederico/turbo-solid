#!/usr/bin/env node
// @ts-check
/**
 * Starter setup / scaffolding wizard.
 *
 * Run this right after cloning the monorepo. It asks a few questions about which
 * stack you want, then removes every app / package / script you are NOT using and
 * cleans up the workspace manifests that reference them.
 *
 * Zero dependencies on purpose: it must run before `pnpm install`.
 *
 *   node scripts/setup/index.mjs            # interactive
 *   node scripts/setup/index.mjs --dry-run  # preview, change nothing
 *   node scripts/setup/index.mjs --yes      # accept defaults, no prompts
 *
 * NOTE: this only removes whole directories and prunes workspace dependencies in
 * the remaining package.json files. It does NOT rewrite your source code, so if a
 * file you keep still imports a package you removed, that import is reported as a
 * warning for you to fix by hand.
 */

import { readFileSync, writeFileSync, existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { stdin, stdout, argv, exit } from "node:process";
import { execSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// ---------------------------------------------------------------------------
// CLI flags
// ---------------------------------------------------------------------------
const FLAGS = new Set(argv.slice(2));
const DRY_RUN = FLAGS.has("--dry-run") || FLAGS.has("-n");
const ASSUME_YES = FLAGS.has("--yes") || FLAGS.has("-y");

// ---------------------------------------------------------------------------
// tiny ansi helpers
// ---------------------------------------------------------------------------
const c = {
	reset: "\x1b[0m",
	bold: "\x1b[1m",
	dim: "\x1b[2m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	cyan: "\x1b[36m",
};
const paint = (color, s) => `${c[color]}${s}${c.reset}`;
const log = (...a) => console.log(...a);
const title = (s) => log(`\n${paint("bold", paint("cyan", s))}`);
const warn = (s) => log(paint("yellow", `⚠ ${s}`));
const ok = (s) => log(paint("green", `✓ ${s}`));
const info = (s) => log(paint("dim", s));

// ---------------------------------------------------------------------------
// Feature model
//
// `dirs` are workspace directories (relative to repo root) that belong to a
// feature. Core dirs are always kept. Anything that appears in a feature's dirs
// but is not part of the final selection gets deleted.
// ---------------------------------------------------------------------------
const CORE_DIRS = ["packages/config", "packages/tailwind"];

/** @typedef {{ id: string, label: string, dirs: string[], rootScripts?: string[] }} Choice */

const FRAMEWORKS = /** @type {Choice[]} */ ([
	{
		id: "solid",
		label: "SolidStart  (apps/solid)",
		dirs: ["apps/solid", "packages/router"],
		rootScripts: ["build:web", "dev:solid", "web"],
	},
	{
		id: "next",
		label: "Next.js     (apps/next)",
		dirs: ["apps/next"],
		rootScripts: ["dev:next"],
	},
]);

const WEBGL = /** @type {Choice[]} */ ([
	{ id: "three", label: "three.js  (packages/three)", dirs: ["packages/three", "packages/gl-context"] },
	{ id: "ogl", label: "OGL       (packages/ogl)", dirs: ["packages/ogl", "packages/gl-context"] },
	{ id: "none", label: "None      (no WebGL)", dirs: [] },
]);

/**
 * Optional yes/no features.
 * `requires` lists feature ids that must be enabled for this to be available.
 * `frameworks` restricts availability to certain framework choices.
 */
const OPTIONS = [
	{
		id: "cms",
		label: "Sanity CMS (studio + client package + sync scripts)",
		dirs: ["apps/cms", "packages/sanity", "scripts/sanity-yaml", "scripts/sync-sanity"],
		default: true,
	},
	{
		id: "seo",
		label: "SEO helpers package (depends on Sanity, Solid only)",
		dirs: ["packages/seo"],
		requires: ["cms"],
		frameworks: ["solid"],
		default: true,
	},
	{
		id: "shopify",
		label: "Shopify ecommerce package (Solid only)",
		dirs: ["packages/shopify"],
		frameworks: ["solid"],
		default: true,
	},
	{
		id: "images",
		label: "Image / font optimise script (scripts/optimise)",
		dirs: ["scripts/optimise"],
		default: true,
	},
];

// Empty / placeholder directories that ship as scaffolding stubs.
const PLACEHOLDER_DIRS = ["apps/astro", "packages/animation", "packages/types", "packages/ui"];

// ---------------------------------------------------------------------------
// prompt helpers
//
// A small line-queue reader so both interactive TTY typing AND piped input
// (e.g. `printf '1\\n2\\n' | node ...`) work. node:readline/promises drops
// buffered lines after the first question, so we roll our own queue.
// ---------------------------------------------------------------------------
const rl = createInterface({ input: stdin });
const lineQueue = [];
const waiters = [];
let stdinClosed = false;
rl.on("line", (line) => {
	const w = waiters.shift();
	if (w) w(line);
	else lineQueue.push(line);
});
rl.on("close", () => {
	stdinClosed = true;
	while (waiters.length) waiters.shift()(null);
});

/** @param {string} prompt @returns {Promise<string|null>} */
function question(prompt) {
	stdout.write(prompt);
	return new Promise((resolve) => {
		if (lineQueue.length) resolve(lineQueue.shift());
		else if (stdinClosed) resolve(null);
		else waiters.push(resolve);
	});
}

async function askSingle(question_text, choices, defaultIndex = 0) {
	if (ASSUME_YES) return choices[defaultIndex];
	title(question_text);
	choices.forEach((ch, i) => {
		const marker = i === defaultIndex ? paint("green", "›") : " ";
		log(`  ${marker} ${paint("bold", String(i + 1))}. ${ch.label}`);
	});
	while (true) {
		const raw = await question(paint("dim", `Choose [1-${choices.length}] (default ${defaultIndex + 1}): `));
		if (raw === null) return choices[defaultIndex]; // EOF -> default
		const ans = raw.trim();
		if (ans === "") return choices[defaultIndex];
		const n = Number(ans);
		if (Number.isInteger(n) && n >= 1 && n <= choices.length) return choices[n - 1];
		warn("Invalid choice, try again.");
	}
}

async function askBool(question_text, def = true) {
	if (ASSUME_YES) return def;
	const hint = def ? "[Y/n]" : "[y/N]";
	while (true) {
		const raw = await question(`${paint("cyan", "?")} ${question_text} ${paint("dim", hint)} `);
		if (raw === null) return def; // EOF -> default
		const ans = raw.trim().toLowerCase();
		if (ans === "") return def;
		if (["y", "yes"].includes(ans)) return true;
		if (["n", "no"].includes(ans)) return false;
		warn("Please answer y or n.");
	}
}

// ---------------------------------------------------------------------------
// json io that preserves indentation + trailing newline
// ---------------------------------------------------------------------------
function readJson(path) {
	const raw = readFileSync(path, "utf8");
	const indentMatch = raw.match(/^[ \t]*(\t|  +)/m);
	const indent = indentMatch ? indentMatch[1] : "  ";
	const trailingNewline = raw.endsWith("\n");
	return { data: JSON.parse(raw), indent, trailingNewline, raw };
}

function writeJson(path, data, indent, trailingNewline) {
	let out = JSON.stringify(data, null, indent);
	if (trailingNewline) out += "\n";
	if (!DRY_RUN) writeFileSync(path, out);
}

// ---------------------------------------------------------------------------
// workspace scanning: build a name <-> dir map for every member package.json
// ---------------------------------------------------------------------------
function scanWorkspace() {
	const dirToName = new Map();
	const nameToDir = new Map();
	for (const group of ["apps", "packages", "scripts"]) {
		const groupDir = join(ROOT, group);
		if (!existsSync(groupDir)) continue;
		for (const entry of readdirSync(groupDir)) {
			const rel = `${group}/${entry}`;
			const pkgPath = join(ROOT, rel, "package.json");
			if (!existsSync(pkgPath)) continue;
			try {
				const { data } = readJson(pkgPath);
				if (data.name) {
					dirToName.set(rel, data.name);
					nameToDir.set(data.name, rel);
				}
			} catch {
				/* ignore unparseable */
			}
		}
	}
	return { dirToName, nameToDir };
}

// ---------------------------------------------------------------------------
// directory helpers
// ---------------------------------------------------------------------------
function dirHasSource(rel) {
	const abs = join(ROOT, rel);
	if (!existsSync(abs)) return false;
	for (const entry of readdirSync(abs)) {
		if (entry === "node_modules" || entry === ".turbo" || entry === ".DS_Store") continue;
		return true; // anything other than ignorable junk counts as content
	}
	return false;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
	title("Monorepo starter setup");
	info("Pick the stack you want — everything else gets removed.");
	if (DRY_RUN) warn("DRY RUN: no files will be changed.");

	// git safety
	let dirty = false;
	try {
		const status = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf8" });
		dirty = status.trim().length > 0;
	} catch {
		warn("Not a git repository — you won't be able to `git checkout` to undo.");
	}
	if (dirty && !DRY_RUN) {
		warn("You have uncommitted changes. This script deletes files; commit or stash first so you can revert.");
		const cont = await askBool("Continue anyway?", false);
		if (!cont) {
			rl.close();
			return;
		}
	}

	const { dirToName } = scanWorkspace();

	// --- gather answers -----------------------------------------------------
	const framework = await askSingle("Which framework do you want to keep?", FRAMEWORKS);
	const webgl = await askSingle("Which WebGL setup do you want?", WEBGL);

	/** @type {Record<string, boolean>} */
	const opts = {};
	for (const opt of OPTIONS) {
		const fwOk = !opt.frameworks || opt.frameworks.includes(framework.id);
		const reqOk = !opt.requires || opt.requires.every((r) => opts[r]);
		if (!fwOk || !reqOk) {
			opts[opt.id] = false; // unavailable -> removed
			continue;
		}
		opts[opt.id] = await askBool(`Include ${opt.label}?`, opt.default);
	}

	let removePlaceholders = true;
	const presentPlaceholders = PLACEHOLDER_DIRS.filter((d) => existsSync(join(ROOT, d)));
	if (presentPlaceholders.length) {
		removePlaceholders = await askBool(
			`Remove ${presentPlaceholders.length} empty placeholder dir(s) (${presentPlaceholders.map((d) => basename(d)).join(", ")})?`,
			true,
		);
	}

	// --- compute keep / remove sets ----------------------------------------
	const keepDirs = new Set([...CORE_DIRS]);
	framework.dirs.forEach((d) => keepDirs.add(d));
	webgl.dirs.forEach((d) => keepDirs.add(d));
	for (const opt of OPTIONS) {
		if (opts[opt.id]) opt.dirs.forEach((d) => keepDirs.add(d));
	}

	// universe of dirs this wizard knows about
	const universe = new Set([
		...CORE_DIRS,
		...FRAMEWORKS.flatMap((f) => f.dirs),
		...WEBGL.flatMap((w) => w.dirs),
		...OPTIONS.flatMap((o) => o.dirs),
	]);

	const removeDirs = [];
	for (const d of universe) {
		if (!keepDirs.has(d) && existsSync(join(ROOT, d))) removeDirs.push(d);
	}
	if (removePlaceholders) {
		for (const d of presentPlaceholders) if (!keepDirs.has(d)) removeDirs.push(d);
	}
	removeDirs.sort();

	const removedNames = new Set(removeDirs.map((d) => dirToName.get(d)).filter(Boolean));

	// --- plan: manifest edits ----------------------------------------------
	const manifestEdits = []; // { path, rel, removedDeps: string[] }
	for (const [rel] of dirToName) {
		if (removeDirs.includes(rel)) continue; // dir is going away anyway
		const pkgPath = join(ROOT, rel, "package.json");
		const { data } = readJson(pkgPath);
		const removed = [];
		for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
			if (!data[field]) continue;
			for (const dep of Object.keys(data[field])) {
				if (removedNames.has(dep)) removed.push(`${field}:${dep}`);
			}
		}
		if (removed.length) manifestEdits.push({ rel, removedDeps: removed });
	}

	// root package.json scripts to prune
	const rootPkgPath = join(ROOT, "package.json");
	const rootScriptsToRemove = [];
	for (const fw of FRAMEWORKS) {
		if (fw.id === framework.id) continue;
		(fw.rootScripts || []).forEach((s) => rootScriptsToRemove.push(s));
	}

	// --- dangling source imports in kept dirs ------------------------------
	// Only library packages get imported by name; apps (web/next/sanity) never do,
	// and their bare names ("next", "web") collide with normal identifiers.
	const importableRemovedNames = new Set(
		removeDirs.filter((d) => d.startsWith("packages/")).map((d) => dirToName.get(d)).filter(Boolean),
	);
	const danglingWarnings = scanDanglingImports(keepDirs, importableRemovedNames, removeDirs);

	// --- show the plan ------------------------------------------------------
	title("Plan");
	log(paint("bold", "Framework: ") + framework.label.trim());
	log(paint("bold", "WebGL:     ") + webgl.label.trim());
	for (const opt of OPTIONS) {
		log(paint("bold", `${opt.id.padEnd(10)} `) + (opts[opt.id] ? paint("green", "keep") : paint("red", "remove")));
	}

	if (removeDirs.length) {
		title("Will DELETE these directories:");
		removeDirs.forEach((d) => log(paint("red", `  - ${d}`) + (dirToName.get(d) ? paint("dim", `  (${dirToName.get(d)})`) : "")));
	} else {
		ok("Nothing to delete.");
	}

	if (manifestEdits.length) {
		title("Will EDIT these package.json files (prune workspace deps):");
		manifestEdits.forEach((e) => log(`  - ${e.rel}` + paint("dim", `  → ${e.removedDeps.join(", ")}`)));
	}

	const presentRootScripts = (() => {
		const { data } = readJson(rootPkgPath);
		return rootScriptsToRemove.filter((s) => data.scripts && s in data.scripts);
	})();
	if (presentRootScripts.length) {
		title("Will REMOVE these root scripts:");
		presentRootScripts.forEach((s) => log(paint("red", `  - ${s}`)));
	}

	if (danglingWarnings.length) {
		title("Heads up — these KEPT files still import REMOVED packages (fix by hand):");
		danglingWarnings.slice(0, 40).forEach((w) => log(paint("yellow", `  - ${w}`)));
		if (danglingWarnings.length > 40) info(`  …and ${danglingWarnings.length - 40} more`);
	}

	// --- confirm + apply ----------------------------------------------------
	if (DRY_RUN) {
		title("Dry run complete — nothing changed.");
		rl.close();
		return;
	}
	if (!removeDirs.length && !manifestEdits.length && !presentRootScripts.length) {
		ok("Workspace already matches your selection. Nothing to do.");
		rl.close();
		return;
	}

	const confirmed = await askBool(paint("red", "Apply these changes? This deletes files."), false);
	if (!confirmed) {
		warn("Aborted. No changes made.");
		rl.close();
		return;
	}

	// delete dirs
	for (const d of removeDirs) {
		rmSync(join(ROOT, d), { recursive: true, force: true });
		ok(`removed ${d}`);
	}

	// prune manifests
	for (const e of manifestEdits) {
		const pkgPath = join(ROOT, e.rel, "package.json");
		const { data, indent, trailingNewline } = readJson(pkgPath);
		for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
			if (!data[field]) continue;
			for (const dep of Object.keys(data[field])) {
				if (removedNames.has(dep)) delete data[field][dep];
			}
			if (Object.keys(data[field]).length === 0) delete data[field];
		}
		writeJson(pkgPath, data, indent, trailingNewline);
		ok(`cleaned ${e.rel}/package.json`);
	}

	// prune root scripts
	if (presentRootScripts.length) {
		const { data, indent, trailingNewline } = readJson(rootPkgPath);
		for (const s of presentRootScripts) delete data.scripts[s];
		writeJson(rootPkgPath, data, indent, trailingNewline);
		ok("cleaned root scripts");
	}

	// persist the answers
	const record = {
		generatedAt: new Date().toISOString(),
		framework: framework.id,
		webgl: webgl.id,
		options: opts,
		removedDirs: removeDirs,
		removedPackages: [...removedNames],
	};
	writeJson(join(ROOT, ".starter.json"), record, "\t", true);
	ok("wrote .starter.json");

	// offer install
	title("Done.");
	if (danglingWarnings.length) {
		warn(`${danglingWarnings.length} source import(s) now point at removed packages — fix them before building.`);
	}
	const doInstall = await askBool("Run `pnpm install` now to refresh the lockfile?", true);
	rl.close();
	if (doInstall) {
		log(paint("dim", "\n$ pnpm install\n"));
		try {
			execSync("pnpm install", { cwd: ROOT, stdio: "inherit" });
		} catch {
			warn("pnpm install failed — run it manually once the dangling imports are fixed.");
		}
	} else {
		info("Remember to run `pnpm install` to regenerate the lockfile.");
	}
}

// ---------------------------------------------------------------------------
// scan kept source for imports of removed packages
// ---------------------------------------------------------------------------
function scanDanglingImports(keepDirs, removedNames, removeDirs) {
	if (removedNames.size === 0) return [];
	const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
	const results = [];
	const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	// match `from "name"`, `import "name"`, `require("name")`, incl. subpaths
	const patterns = [...removedNames].map((name) => ({
		name,
		re: new RegExp(`(?:from|import|require\\()\\s*['"]${esc(name)}(?:/[^'"]*)?['"]`),
	}));

	/** @param {string} absDir @param {string} relDir */
	const walk = (absDir, relDir) => {
		let entries;
		try {
			entries = readdirSync(absDir);
		} catch {
			return;
		}
		for (const entry of entries) {
			if (entry === "node_modules" || entry === ".turbo" || entry === "dist" || entry === ".output" || entry.startsWith(".")) continue;
			const abs = join(absDir, entry);
			const rel = `${relDir}/${entry}`;
			let st;
			try {
				st = statSync(abs);
			} catch {
				continue;
			}
			if (st.isDirectory()) {
				walk(abs, rel);
			} else if (exts.has(entry.slice(entry.lastIndexOf(".")))) {
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

	// only scan dirs we keep (and aren't being removed)
	for (const rel of keepDirs) {
		if (removeDirs.includes(rel)) continue;
		const abs = join(ROOT, rel);
		if (existsSync(abs)) walk(abs, rel);
	}
	return results;
}

main()
	.catch((err) => {
		rl.close();
		console.error(paint("red", "\nSetup failed:"), err);
		exit(1);
	});
