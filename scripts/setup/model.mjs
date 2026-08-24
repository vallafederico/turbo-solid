// @ts-check
/**
 * Feature graph + cleanup plan for the starter wizard.
 * The plan is data: apply.mjs is the only place that touches the filesystem
 * for writes (buildPlan may stat paths so the preview stays honest).
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { confirm, multiSelect, select } from "./prompts.mjs";

export const FRAMEWORKS = [
	{ value: "solid", label: "SolidStart", hint: "Solid + @acme/router" },
	{ value: "next", label: "Next.js", hint: "App Router + view transitions" },
	{ value: "astro", label: "Astro", hint: "Taxi + data-modules" },
];

export const CMS_OPTIONS = [
	{ value: "sanity", label: "Sanity", hint: "Studio + @local/sanity" },
	{ value: "none", label: "None", hint: "Static pages, no CMS" },
];

export function webglOptions(root) {
	const options = [
		{ value: "three", label: "three.js", hint: "@local/three + webgl routes" },
		{ value: "none", label: "None", hint: "No WebGL packages or pages" },
	];
	if (existsSync(join(root, "packages/ogl"))) {
		options.splice(1, 0, { value: "ogl", label: "OGL", hint: "@local/ogl" });
	}
	return options;
}

const CORE_KEEP = ["packages/config", "packages/tailwind", "packages/modules"];

const FRAMEWORK_DIRS = {
	solid: ["apps/solid", "packages/router"],
	next: ["apps/next"],
	astro: ["apps/astro"],
};

const CMS_DIRS = {
	sanity: ["apps/cms", "packages/sanity", "scripts/sanity-yaml", "scripts/sync-sanity"],
};

const WEBGL_DIRS = {
	three: ["packages/three", "packages/gl-context"],
	ogl: ["packages/ogl", "packages/gl-context"],
};

const EXTRA_DIRS = {
	seo: ["packages/seo"],
	shopify: ["packages/shopify"],
	optimise: ["scripts/optimise"],
};

const PLACEHOLDER_DIRS = ["packages/animation", "packages/types", "packages/ui"];

const ALWAYS_KEEP_SCRIPTS = [
	"build",
	"dev",
	"test",
	"test:watch",
	"typecheck",
	"check",
	"scaffold",
	"setup",
];

const ROOT_SCRIPT_KEYS = {
	solid: ["dev:solid", "build:web", "web"],
	next: ["dev:next"],
	astro: ["dev:astro"],
	cms: ["dev:cms"],
	optimise: ["optimise"],
};

const CANDIDATE_DIRS = [
	"apps/solid",
	"apps/next",
	"apps/astro",
	"apps/cms",
	"packages/router",
	"packages/sanity",
	"packages/seo",
	"packages/shopify",
	"packages/three",
	"packages/ogl",
	"packages/gl-context",
	"scripts/sanity-yaml",
	"scripts/sync-sanity",
	"scripts/optimise",
	...PLACEHOLDER_DIRS,
];

function extraChoices(answers) {
	const extras = [];
	if (answers.framework === "solid" && answers.cms === "sanity") {
		extras.push({
			value: "seo",
			label: "SEO package",
			hint: "@local/seo + SanityMeta",
		});
	}
	if (answers.framework === "solid") {
		extras.push({
			value: "shopify",
			label: "Shopify",
			hint: "@local/shopify + /_/shop",
		});
	}
	extras.push({
		value: "optimise",
		label: "Image & font optimise",
		hint: "Keep scripts/optimise",
	});
	return extras;
}

export function defaultAnswers() {
	return {
		framework: "solid",
		cms: "sanity",
		webgl: "three",
		extras: ["seo", "shopify", "optimise"],
		runInstall: true,
	};
}

export function parseArgs(argv) {
	const args = { dryRun: false, yes: false, help: false };
	for (const arg of argv) {
		if (arg === "--dry-run" || arg === "-n") args.dryRun = true;
		else if (arg === "--yes" || arg === "-y") args.yes = true;
		else if (arg === "--help" || arg === "-h") args.help = true;
	}
	return args;
}

export function printHelp() {
	console.log(`
Usage: pnpm setup [--yes] [--dry-run]

Interactive wizard. Arrow keys to move, space to toggle extras, enter to confirm.

  --yes, -y      Use defaults (Solid + Sanity + three.js + all extras)
  --dry-run, -n  Print the cleanup plan without changing the repo
  --help, -h     Show this help
`);
}

/**
 * @param {string} root
 * @param {{ yes?: boolean }} args
 * @param {import("./prompts.mjs").PromptCtx} ctx
 */
export async function collectAnswers(root, args, ctx) {
	if (args.yes) return defaultAnswers();

	const answers = {
		framework: "solid",
		cms: "sanity",
		webgl: "three",
		/** @type {string[]} */
		extras: [],
		runInstall: true,
	};

	answers.framework = await select(ctx, "Framework", FRAMEWORKS, 0);
	answers.cms = await select(ctx, "CMS", CMS_OPTIONS, 0);
	answers.webgl = await select(ctx, "WebGL", webglOptions(root), 0);

	const extras = extraChoices(answers);
	answers.extras = extras.length ? await multiSelect(ctx, "Extras", extras) : [];
	answers.runInstall = await confirm(ctx, "Run pnpm install after cleanup?", true);
	return answers;
}

function hasExtra(answers, name) {
	return answers.extras.includes(name);
}

function navLink(file, href) {
	return { type: "remove-nav-link", path: file, href };
}

function patchFile(path, patches) {
	return { type: "patch-file", path, patches };
}

function replaceFile(path, contents) {
	return { type: "write-file", path, contents };
}

function deletePaths(paths) {
	return paths.map((path) => ({ type: "delete", path }));
}

const CLIENT_RECT_NO_GL = `import { Scroll } from "./scroll";
import { viewport } from "../stores/viewportStore";

export interface ClientRectBounds {
  top: number;
  bottom: number;
  width: number;
  height: number;
  left: number;
  right: number;
  wh: number;
  ww: number;
  offset: number;
}

export const clientRect = (element: HTMLElement): ClientRectBounds => {
  const bounds = element.getBoundingClientRect();
  const { scroll } = Scroll.lenis;

  return {
    top: bounds.top + scroll,
    bottom: bounds.bottom + scroll,
    width: bounds.width,
    height: bounds.height,
    left: bounds.left,
    right: bounds.right,
    wh: viewport.size.height,
    ww: viewport.size.width,
    offset: bounds.top + scroll,
  };
};
`;

const STATIC_HOME_SOLID = `export default function Home() {
	return (
		<main class="flex min-h-svh flex-col">
			<section class="flex flex-1 items-center px-gx">
				<h1 class="col-span-full text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.9] tracking-tight">
					Starter
				</h1>
			</section>
		</main>
	);
}
`;

const STATIC_HOME_NEXT = `export default function Home() {
  return (
    <main className="flex min-h-svh flex-col">
      <section className="flex flex-1 items-center px-gx">
        <h1 className="col-span-full text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.9] tracking-tight">
          Starter
        </h1>
      </section>
    </main>
  );
}
`;

const STATIC_HOME_ASTRO = `---
import PageLayout from "~/layouts/PageLayout.astro";
import Nav from "~/components/Nav.astro";
---

<PageLayout title="Home">
  <Nav slot="chrome" />
  <section class="flex min-h-svh flex-1 items-center px-gx">
    <h1 class="col-span-full text-[clamp(2.5rem,8vw,7rem)] font-medium leading-[0.9] tracking-tight">
      Starter
    </h1>
  </section>
</PageLayout>
`;

function wantsSeo(answers) {
	return (
		answers.framework === "solid" &&
		answers.cms === "sanity" &&
		hasExtra(answers, "seo")
	);
}

function wantsShopify(answers) {
	return answers.framework === "solid" && hasExtra(answers, "shopify");
}

function rootScriptKeys(answers) {
	const keys = [...ALWAYS_KEEP_SCRIPTS, ...(ROOT_SCRIPT_KEYS[answers.framework] ?? [])];
	if (answers.cms !== "none") keys.push(...ROOT_SCRIPT_KEYS.cms);
	if (hasExtra(answers, "optimise")) keys.push(...ROOT_SCRIPT_KEYS.optimise);
	return keys;
}

export function buildPlan(root, answers) {
	const keep = new Set(CORE_KEEP);
	for (const dir of FRAMEWORK_DIRS[answers.framework] ?? []) keep.add(dir);
	if (answers.cms !== "none") {
		for (const dir of CMS_DIRS[answers.cms] ?? []) keep.add(dir);
	}
	if (answers.webgl !== "none") {
		for (const dir of WEBGL_DIRS[answers.webgl] ?? []) keep.add(dir);
	}
	if (wantsSeo(answers)) {
		for (const dir of EXTRA_DIRS.seo) keep.add(dir);
	}
	if (wantsShopify(answers)) {
		for (const dir of EXTRA_DIRS.shopify) keep.add(dir);
	}
	if (hasExtra(answers, "optimise")) {
		for (const dir of EXTRA_DIRS.optimise) keep.add(dir);
	}

	/** @type {object[]} */
	const ops = [];

	for (const dir of CANDIDATE_DIRS) {
		if (!keep.has(dir) && existsSync(join(root, dir))) {
			ops.push({ type: "delete", path: dir });
		}
	}

	if (answers.webgl === "none") {
		if (answers.framework === "solid") {
			ops.push(...deletePaths([
				"apps/solid/src/routes/_/webgl",
				"apps/solid/src/lib/stores/webglStore.ts",
			]));
			ops.push(navLink("apps/solid/src/components/Nav.tsx", "/_/webgl"));
			ops.push(patchFile("apps/solid/src/app.tsx", [
				{ type: "remove-const", name: "ClientCanvas" },
				{ type: "remove-jsx", tag: "ClientCanvas" },
				{ type: "sweep-imports" },
			]));
			ops.push(replaceFile("apps/solid/src/lib/utils/clientRect.ts", CLIENT_RECT_NO_GL));
			ops.push(patchFile("apps/solid/app.config.ts", [
				{ type: "remove-line-includes", needles: ["three"] },
			]));
			ops.push({
				type: "remove-package-deps",
				pkg: "apps/solid",
				names: ["three", "@local/three", "@local/gl-context"],
			});
		}
		if (answers.framework === "next") {
			ops.push(...deletePaths([
				"apps/next/app/%5F/webgl",
				"apps/next/components/WebglCanvas.tsx",
				"apps/next/lib/clientRectGl.ts",
				"apps/next/lib/webglStore.ts",
				"apps/next/lib/webgl-assets.ts",
				"apps/next/lib/gui.ts",
			]));
			ops.push(navLink("apps/next/components/Nav.tsx", "/_/webgl"));
			ops.push(patchFile("apps/next/components/AppShell.tsx", [
				{ type: "remove-const", name: "WebglCanvas" },
				{ type: "remove-jsx", tag: "WebglCanvas" },
				{ type: "sweep-imports" },
			]));
			ops.push(patchFile("apps/next/next.config.ts", [
				{ type: "empty-transpile-packages" },
			]));
			ops.push({
				type: "remove-package-deps",
				pkg: "apps/next",
				names: ["@local/three"],
			});
		}
	}

	if (answers.cms === "none") {
		if (answers.framework === "solid") {
			ops.push(...deletePaths([
				"apps/solid/src/components/slices",
				"apps/solid/src/routes/_/content",
				"apps/solid/src/routes/api/robots.txt.ts",
				"apps/solid/src/routes/api/preview-enable.ts",
				"apps/solid/src/routes/api/preview-disable.ts",
			]));
			ops.push(navLink("apps/solid/src/components/Nav.tsx", "/_/content"));
			ops.push(replaceFile("apps/solid/src/routes/(home).tsx", STATIC_HOME_SOLID));
			ops.push(patchFile("apps/solid/src/app.tsx", [
				{ type: "remove-robots-link" },
				{ type: "sweep-imports" },
			]));
		}
		if (answers.framework === "next") {
			ops.push(...deletePaths([
				"apps/next/lib/home-seo.ts",
				"apps/next/app/%5F/content",
			]));
			ops.push(navLink("apps/next/components/Nav.tsx", "/_/content"));
			ops.push(replaceFile("apps/next/app/page.tsx", STATIC_HOME_NEXT));
		}
		if (answers.framework === "astro") {
			ops.push(...deletePaths([
				"apps/astro/src/pages/_/content.astro",
				"apps/astro/src/components/slices",
			]));
			ops.push(navLink("apps/astro/src/components/Nav.astro", "/_/content"));
			ops.push(replaceFile("apps/astro/src/pages/index.astro", STATIC_HOME_ASTRO));
		}
	} else if (answers.framework === "solid" && !hasExtra(answers, "seo")) {
		ops.push(patchFile("apps/solid/src/routes/(home).tsx", [
			{ type: "remove-jsx", tag: "SanityMeta" },
			{ type: "sweep-imports" },
		]));
		ops.push(patchFile("apps/solid/src/routes/_/animation/(animation).tsx", [
			{ type: "remove-jsx", tag: "SanityMeta" },
			{ type: "sweep-imports" },
		]));
		if (wantsShopify(answers)) {
			ops.push(patchFile("apps/solid/src/routes/_/shop/[handle].tsx", [
				{ type: "remove-jsx", tag: "SchemaMarkup" },
				{ type: "sweep-imports" },
			]));
		}
	}

	if (answers.framework === "solid" && !wantsShopify(answers)) {
		ops.push(...deletePaths([
			"apps/solid/src/routes/_/shop",
			"apps/solid/src/routes/_/shop.tsx",
			"apps/solid/src/components/shop",
			"apps/solid/src/lib/shopify",
			"apps/solid/src/routes/api/shopify",
		]));
		ops.push(navLink("apps/solid/src/components/Nav.tsx", "/_/shop"));
		ops.push(patchFile("apps/solid/app.config.ts", [
			{ type: "strip-shopify-config" },
		]));
	}

	ops.push({ type: "prune-workspace-deps" });
	ops.push({ type: "prune-root-scripts", keepKeys: rootScriptKeys(answers) });
	ops.push({
		type: "write-starter",
		contents: {
			framework: answers.framework,
			cms: answers.cms,
			webgl: answers.webgl,
			extras: answers.extras,
			createdAt: new Date().toISOString(),
		},
	});

	return {
		answers,
		keep: [...keep].sort(),
		ops: ops.filter((op) => op.type !== "delete" || existsSync(join(root, op.path))),
	};
}

export function describePlan(plan) {
	const lines = [];
	const deletes = plan.ops.filter((op) => op.type === "delete").map((op) => op.path);
	const writes = plan.ops.filter((op) => op.type === "write-file").map((op) => op.path);
	const patches = plan.ops.filter((op) => op.type === "patch-file").map((op) => op.path);
	const navs = plan.ops
		.filter((op) => op.type === "remove-nav-link")
		.map((op) => `${op.path} (${op.href})`);

	lines.push(`  Framework   ${plan.answers.framework}`);
	lines.push(`  CMS         ${plan.answers.cms}`);
	lines.push(`  WebGL       ${plan.answers.webgl}`);
	lines.push(`  Extras      ${plan.answers.extras.join(", ") || "none"}`);
	lines.push("");
	lines.push(`  Keep        ${plan.keep.join(", ")}`);
	if (deletes.length) {
		lines.push("");
		lines.push("  Delete");
		for (const path of deletes) lines.push(`    - ${path}`);
	}
	if (writes.length) {
		lines.push("");
		lines.push("  Replace");
		for (const path of writes) lines.push(`    - ${path}`);
	}
	if (patches.length || navs.length) {
		lines.push("");
		lines.push("  Patch");
		for (const path of [...new Set(patches)]) lines.push(`    - ${path}`);
		for (const nav of navs) lines.push(`    - ${nav}`);
	}
	return lines.join("\n");
}
