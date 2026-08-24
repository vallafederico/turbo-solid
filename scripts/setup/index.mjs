#!/usr/bin/env node
// @ts-check
/**
 * Starter setup wizard.
 *
 *   pnpm setup                 # interactive (arrow keys / space / enter)
 *   pnpm setup --dry-run       # preview, change nothing
 *   pnpm setup --yes           # accept defaults, no prompts
 *
 * Zero dependencies on purpose: it must run before `pnpm install`.
 */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { argv, exit } from "node:process";
import { execSync } from "node:child_process";
import { applyPlan } from "./apply.mjs";
import { buildPlan, collectAnswers, describePlan, parseArgs, printHelp } from "./model.mjs";
import { confirm, createPromptCtx, info, ok, paint, title, warn } from "./prompts.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

async function main() {
	const args = parseArgs(argv.slice(2));
	if (args.help) {
		printHelp();
		return;
	}

	title("starter setup");
	info("Pick a stack. Unused apps, packages, and feature files get removed.");
	if (args.dryRun) warn("DRY RUN: no files will be changed.");
	if (existsSync(join(ROOT, ".starter.json"))) {
		warn("This repo already has a .starter.json — running again will delete more.");
	}

	const ctx = createPromptCtx(args.yes);
	try {
		let dirty = false;
		try {
			const status = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf8" });
			dirty = status.trim().length > 0;
		} catch {
			warn("Not a git repository — you won't be able to git checkout to undo.");
		}
		if (dirty && !args.dryRun) {
			warn("You have uncommitted changes. This script deletes files; commit or stash first so you can revert.");
			if (!args.yes) {
				const cont = await confirm(ctx, "Continue anyway?", false);
				if (!cont) {
					warn("Cancelled. Repo unchanged.");
					return;
				}
			}
		}

		const answers = await collectAnswers(ROOT, args, ctx);
		const plan = buildPlan(ROOT, answers);

		title("cleanup plan");
		console.log(describePlan(plan));
		console.log("");

		if (args.dryRun) {
			title("Dry run complete — nothing changed.");
			return;
		}

		const confirmed = args.yes || (await confirm(ctx, "Apply this cleanup? This deletes unused apps, packages, and feature files.", false));
		if (!confirmed) {
			warn("Cancelled. Repo unchanged.");
			return;
		}

		const result = applyPlan(ROOT, plan);
		title("Done.");
		if (result.dangling.length) {
			warn(`${result.dangling.length} kept file(s) still import removed packages:`);
			for (const line of result.dangling.slice(0, 40)) console.log(paint("yellow", `  - ${line}`));
			if (result.dangling.length > 40) info(`  …and ${result.dangling.length - 40} more`);
		} else {
			ok("No dangling workspace imports in kept apps.");
		}

		if (answers.runInstall) {
			console.log(paint("dim", "\n$ pnpm install\n"));
			try {
				execSync("pnpm install", { cwd: ROOT, stdio: "inherit" });
			} catch {
				warn("pnpm install failed — run it manually if the lockfile still lists removed packages.");
			}
		} else {
			info("Remember to run `pnpm install` to regenerate the lockfile.");
		}
	} catch (err) {
		if (err instanceof Error && err.message === "cancelled") {
			warn("Cancelled.");
			exit(130);
		}
		throw err;
	} finally {
		ctx.close();
	}
}

main().catch((err) => {
	console.error(paint("red", "\nSetup failed:"), err);
	exit(1);
});
