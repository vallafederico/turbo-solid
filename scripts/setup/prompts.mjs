// @ts-check
/**
 * Zero-dep prompts. Arrow-key select when stdin is a TTY;
 * numbered / y-n fallback for pipes and `--yes`.
 */

import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

const ESC = "\x1b";
export const c = {
	reset: `${ESC}[0m`,
	bold: `${ESC}[1m`,
	dim: `${ESC}[2m`,
	red: `${ESC}[31m`,
	green: `${ESC}[32m`,
	yellow: `${ESC}[33m`,
	cyan: `${ESC}[36m`,
	inverse: `${ESC}[7m`,
};
export const paint = (color, s) => `${c[color]}${s}${c.reset}`;
export const log = (...a) => console.log(...a);
export const title = (s) => log(`\n${paint("bold", paint("cyan", s))}`);
export const warn = (s) => log(paint("yellow", `⚠ ${s}`));
export const ok = (s) => log(paint("green", `✓ ${s}`));
export const info = (s) => log(paint("dim", s));

const HIDE = `${ESC}[?25l`;
const SHOW = `${ESC}[?25h`;
const CLEAR_LINE = `${ESC}[2K`;

export const isInteractive = () => Boolean(stdin.isTTY && stdout.isTTY);

/** @typedef {{ input: import("node:readline").Interface, assumeYes: boolean, close: () => void }} PromptCtx */

export function createPromptCtx(assumeYes) {
	/** @type {import("node:readline").Interface | null} */
	let rl = null;
	/** @type {string[]} */
	const lineQueue = [];
	/** @type {((line: string|null) => void)[]} */
	const waiters = [];
	let stdinClosed = false;

	function ensureRl() {
		if (rl) return;
		// Only attach readline for piped / numbered fallback. A TTY raw-mode
		// select cannot share stdin with readline or keypresses get stolen.
		rl = createInterface({ input: stdin, terminal: false });
		rl.on("line", (line) => {
			const w = waiters.shift();
			if (w) w(line);
			else lineQueue.push(line);
		});
		rl.on("close", () => {
			stdinClosed = true;
			while (waiters.length) waiters.shift()?.(null);
		});
	}

	/** @param {string} prompt */
	function readLine(prompt) {
		ensureRl();
		stdout.write(prompt);
		return new Promise((resolve) => {
			if (lineQueue.length) resolve(lineQueue.shift() ?? "");
			else if (stdinClosed) resolve(null);
			else waiters.push(resolve);
		});
	}

	return {
		assumeYes,
		readLine,
		close() {
			restoreTerminal();
			rl?.close();
		},
	};
}

function restoreTerminal() {
	if (!stdin.isTTY) return;
	try {
		stdin.setRawMode(false);
	} catch {
		/* already cooked */
	}
	stdout.write(SHOW);
}

function onSigint(handler) {
	const wrapped = () => handler();
	process.on("SIGINT", wrapped);
	return () => process.off("SIGINT", wrapped);
}

/**
 * @param {string} key
 * @returns {"up"|"down"|"left"|"right"|"enter"|"space"|"escape"|"interrupt"|{type:"char", value: string}}
 */
function parseKey(key) {
	if (key === "\u0003") return "interrupt";
	if (key === "\r" || key === "\n") return "enter";
	if (key === " " || key === "\u00a0") return "space";
	if (key === "\u001b" || key === "\u001b\u001b") return "escape";
	if (key === "\u001b[A" || key === "\u001bOA" || key === "k") return "up";
	if (key === "\u001b[B" || key === "\u001bOB" || key === "j") return "down";
	if (key === "\u001b[D" || key === "\u001bOD" || key === "h") return "left";
	if (key === "\u001b[C" || key === "\u001bOC" || key === "l") return "right";
	return { type: "char", value: key };
}

/**
 * @template T
 * @param {PromptCtx} ctx
 * @param {string} message
 * @param {{ value: T, label: string, hint?: string }[]} options
 * @param {number} [initial]
 * @returns {Promise<T>}
 */
export async function select(ctx, message, options, initial = 0) {
	if (ctx.assumeYes) return options[initial].value;
	if (!isInteractive()) return selectFallback(ctx, message, options, initial);

	let index = Math.min(Math.max(initial, 0), options.length - 1);
	let drawn = 0;

	const render = () => {
		const lines = [
			paint("bold", paint("cyan", message)),
			paint("dim", "↑↓ move · enter select · 1–9 jump"),
			...options.map((opt, i) => {
				const on = i === index;
				const mark = on ? paint("green", "❯") : " ";
				const label = on ? paint("bold", opt.label) : opt.label;
				const hint = opt.hint ? paint("dim", `  ${opt.hint}`) : "";
				return `  ${mark} ${label}${hint}`;
			}),
		];
		redraw(lines, drawn);
		drawn = lines.length;
	};

	return rawLoop(render, (event) => {
		if (event === "up") index = (index - 1 + options.length) % options.length;
		else if (event === "down") index = (index + 1) % options.length;
		else if (event === "enter") return { done: options[index].value };
		else if (typeof event === "object" && event.type === "char") {
			const n = Number(event.value);
			if (Number.isInteger(n) && n >= 1 && n <= options.length) {
				return { done: options[n - 1].value };
			}
		}
		return { redraw: true };
	}, () => drawn);
}

/**
 * @param {PromptCtx} ctx
 * @param {string} message
 * @param {boolean} [def]
 */
export async function confirm(ctx, message, def = true) {
	if (ctx.assumeYes) return def;
	if (!isInteractive()) return confirmFallback(ctx, message, def);

	const options = [
		{ value: true, label: "Yes" },
		{ value: false, label: "No" },
	];
	return select(ctx, message, options, def ? 0 : 1);
}

/**
 * @param {PromptCtx} ctx
 * @param {string} message
 * @param {{ value: string, label: string, hint?: string, selected?: boolean }[]} options
 * @returns {Promise<string[]>}
 */
export async function multiSelect(ctx, message, options) {
	if (!options.length) return [];
	if (ctx.assumeYes) return options.filter((o) => o.selected !== false).map((o) => o.value);
	if (!isInteractive()) return multiFallback(ctx, message, options);

	let index = 0;
	const picked = options.map((o) => o.selected !== false);
	let drawn = 0;

	const render = () => {
		const lines = [
			paint("bold", paint("cyan", message)),
			paint("dim", "↑↓ move · space toggle · enter confirm"),
			...options.map((opt, i) => {
				const on = i === index;
				const box = picked[i] ? paint("green", "●") : paint("dim", "○");
				const mark = on ? paint("green", "❯") : " ";
				const label = on ? paint("bold", opt.label) : opt.label;
				const hint = opt.hint ? paint("dim", `  ${opt.hint}`) : "";
				return `  ${mark} ${box} ${label}${hint}`;
			}),
		];
		redraw(lines, drawn);
		drawn = lines.length;
	};

	return rawLoop(render, (event) => {
		if (event === "up") index = (index - 1 + options.length) % options.length;
		else if (event === "down") index = (index + 1) % options.length;
		else if (event === "space") picked[index] = !picked[index];
		else if (event === "enter") {
			return { done: options.filter((_, i) => picked[i]).map((o) => o.value) };
		} else if (typeof event === "object" && event.type === "char") {
			const n = Number(event.value);
			if (Number.isInteger(n) && n >= 1 && n <= options.length) {
				picked[n - 1] = !picked[n - 1];
				index = n - 1;
			}
		}
		return { redraw: true };
	}, () => drawn);
}

/**
 * @template T
 * @param {() => void} render
 * @param {(event: ReturnType<typeof parseKey>) => { done?: T, redraw?: boolean }} handle
 * @param {() => number} drawn
 */
function rawLoop(render, handle, drawn) {
	return new Promise((resolve, reject) => {
		stdin.setRawMode(true);
		stdin.resume();
		stdin.setEncoding("utf8");
		stdout.write(HIDE);
		render();

		const offInt = onSigint(() => {
			cleanup();
			stdout.write("\n");
			reject(new Error("cancelled"));
		});

		const onData = (chunk) => {
			const event = parseKey(String(chunk));
			if (event === "interrupt") {
				cleanup();
				stdout.write("\n");
				reject(new Error("cancelled"));
				return;
			}
			if (event === "escape") return;
			const result = handle(event);
			if (result && "done" in result) {
				cleanup();
				stdout.write("\n");
				resolve(result.done);
				return;
			}
			if (result?.redraw) render();
		};

		function cleanup() {
			stdin.off("data", onData);
			offInt();
			restoreTerminal();
			// leave the final render on screen
			void drawn;
		}

		stdin.on("data", onData);
	});
}

function redraw(lines, previous) {
	if (previous > 0) stdout.write(`${ESC}[${previous}A`);
	for (const line of lines) stdout.write(`${CLEAR_LINE}${line}\n`);
	if (previous > lines.length) {
		for (let i = 0; i < previous - lines.length; i++) stdout.write(`${CLEAR_LINE}\n`);
		stdout.write(`${ESC}[${previous - lines.length}A`);
	}
}

/** @template T */
async function selectFallback(ctx, message, options, initial) {
	title(message);
	options.forEach((opt, i) => {
		const mark = i === initial ? paint("green", "›") : " ";
		log(`  ${mark} ${paint("bold", String(i + 1))}. ${opt.label}${opt.hint ? paint("dim", `  ${opt.hint}`) : ""}`);
	});
	while (true) {
		const raw = await ctx.readLine(paint("dim", `Choose [1-${options.length}] (default ${initial + 1}): `));
		if (raw === null) return options[initial].value;
		const ans = raw.trim();
		if (ans === "") return options[initial].value;
		const n = Number(ans);
		if (Number.isInteger(n) && n >= 1 && n <= options.length) return options[n - 1].value;
		warn("Invalid choice, try again.");
	}
}

async function confirmFallback(ctx, message, def) {
	const hint = def ? "[Y/n]" : "[y/N]";
	while (true) {
		const raw = await ctx.readLine(`${paint("cyan", "?")} ${message} ${paint("dim", hint)} `);
		if (raw === null) return def;
		const ans = raw.trim().toLowerCase();
		if (ans === "") return def;
		if (["y", "yes"].includes(ans)) return true;
		if (["n", "no"].includes(ans)) return false;
		warn("Please answer y or n.");
	}
}

async function multiFallback(ctx, message, options) {
	title(message);
	info("Answer y/n for each.");
	const picked = [];
	for (const opt of options) {
		const on = await confirmFallback(ctx, opt.label, opt.selected !== false);
		if (on) picked.push(opt.value);
	}
	return picked;
}
