// @ts-check
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPlan, defaultAnswers, parseArgs } from "./model.mjs";
import {
	emptyTranspilePackages,
	removeConstDecl,
	removeJsxTag,
	removeNavLink,
	removeRobotsLink,
	stripShopifyConfig,
	stripThreeConfig,
	sweepUnusedImports,
} from "./apply.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function paths(plan, type) {
	return plan.ops.filter((op) => op.type === type).map((op) => op.path);
}

describe("parseArgs", () => {
	it("reads flags", () => {
		assert.deepEqual(parseArgs(["--yes", "--dry-run"]), {
			dryRun: true,
			yes: true,
			help: false,
		});
	});
});

describe("buildPlan", () => {
	it("default Solid keeps the full stack", () => {
		const plan = buildPlan(ROOT, defaultAnswers());
		assert.deepEqual(plan.keep, [
			"apps/cms",
			"apps/solid",
			"packages/config",
			"packages/gl-context",
			"packages/modules",
			"packages/router",
			"packages/sanity",
			"packages/seo",
			"packages/shopify",
			"packages/tailwind",
			"packages/three",
			"scripts/optimise",
			"scripts/sanity-yaml",
			"scripts/sync-sanity",
		]);
		assert.ok(paths(plan, "delete").includes("apps/next"));
		assert.ok(paths(plan, "delete").includes("apps/astro"));
		assert.ok(!paths(plan, "delete").includes("apps/solid"));
		assert.ok(!paths(plan, "delete").includes("packages/three"));
	});

	it("Next + no CMS + no WebGL deletes unused stack and feature files", () => {
		const plan = buildPlan(ROOT, {
			framework: "next",
			cms: "none",
			webgl: "none",
			extras: ["optimise"],
			runInstall: false,
		});
		const deletes = paths(plan, "delete");
		for (const path of [
			"apps/solid",
			"apps/astro",
			"apps/cms",
			"packages/router",
			"packages/sanity",
			"packages/seo",
			"packages/shopify",
			"packages/three",
			"packages/gl-context",
			"apps/next/app/%5F/webgl",
			"apps/next/app/%5F/content",
			"apps/next/components/WebglCanvas.tsx",
		]) {
			assert.ok(deletes.includes(path), `expected delete ${path}`);
		}
		assert.ok(paths(plan, "write-file").includes("apps/next/app/page.tsx"));
		assert.ok(
			plan.ops.some((op) => op.type === "remove-nav-link" && op.href === "/_/webgl"),
		);
		assert.ok(
			plan.ops.some((op) => op.type === "remove-nav-link" && op.href === "/_/content"),
		);
	});

	it("Astro + Sanity + no WebGL keeps cms and strips other frameworks", () => {
		const plan = buildPlan(ROOT, {
			framework: "astro",
			cms: "sanity",
			webgl: "none",
			extras: [],
			runInstall: false,
		});
		assert.ok(plan.keep.includes("apps/astro"));
		assert.ok(plan.keep.includes("apps/cms"));
		assert.ok(plan.keep.includes("packages/sanity"));
		const deletes = paths(plan, "delete");
		assert.ok(deletes.includes("apps/solid"));
		assert.ok(deletes.includes("apps/next"));
		assert.ok(deletes.includes("packages/three"));
		assert.ok(!deletes.includes("apps/astro/src/pages/_/content.astro"));
	});

	it("Solid without CMS still strips leftover SEO tags", () => {
		const plan = buildPlan(ROOT, {
			framework: "solid",
			cms: "none",
			webgl: "none",
			extras: ["optimise"],
			runInstall: false,
		});
		assert.ok(
			plan.ops.some(
				(op) =>
					op.type === "patch-file" &&
					op.path === "apps/solid/src/routes/_/animation/(animation).tsx",
			),
		);
		assert.ok(
			plan.ops.some(
				(op) =>
					op.type === "delete" &&
					String(op.path).includes("app.config.timestamp_"),
			),
		);
	});
});

describe("source patches", () => {
	it("removes a multiline const and its JSX", () => {
		const src = `import { clientOnly } from "@solidjs/start";
import { Gui } from "~/lib/utils/gui";
import { Scroll } from "~/lib/utils/scroll";

const ClientCanvas = clientOnly(() =>
  import("@local/three/solid").then((m) => ({ default: m.Canvas })),
);

export function App() {
  return (
    <div>
      <Scroll />
      <ClientCanvas
        deps={{
          Gui,
        }}
      />
    </div>
  );
}
`;
		const next = sweepUnusedImports(removeJsxTag(removeConstDecl(src, "ClientCanvas"), "ClientCanvas"));
		assert.equal(next.includes("ClientCanvas"), false);
		assert.equal(next.includes("@local/three"), false);
		assert.equal(next.includes("Gui"), false);
		assert.equal(next.includes("clientOnly"), false);
		assert.equal(next.includes("Scroll"), true);
	});

	it("removes SanityMeta even when props contain >", () => {
		const src = `import { SanityMeta } from "@local/seo";
const data = () => ({});
export default function Home() {
  return <SanityMeta isHomepage={true} pageData={data()} />;
}
`;
		const next = sweepUnusedImports(removeJsxTag(src, "SanityMeta"));
		assert.equal(next.includes("SanityMeta"), false);
		assert.equal(next.includes("@local/seo"), false);
	});

	it("removes nav link objects", () => {
		const compact = `const NAV_LINKS = [
  { to: "/_/about", text: "About Us" },
  { to: "/_/webgl", text: "WebGl" },
  { to: "/_/shop", text: "Shop" },
];
`;
		const compactNext = removeNavLink(compact, "/_/webgl");
		assert.equal(compactNext.includes("/_/webgl"), false);
		assert.equal(compactNext.includes("/_/about"), true);
		assert.equal(compactNext.includes("/_/shop"), true);

		const multiline = `const NAV_LINKS = [
  {
    href: "/_/about",
    text: "About Us",
  },
  {
    href: "/_/webgl",
    text: "WebGl",
  },
  {
    href: "/_/content",
    text: "CMS Content",
  },
];
`;
		const multiNext = removeNavLink(removeNavLink(multiline, "/_/webgl"), "/_/content");
		assert.equal(multiNext.includes("/_/webgl"), false);
		assert.equal(multiNext.includes("/_/content"), false);
		assert.equal(multiNext.includes("/_/about"), true);
	});

	it("clears transpilePackages and shopify route rules", () => {
		const cfg = `const nextConfig = {
  transpilePackages: ["@local/three", "@local/gl-context"],
};
`;
		assert.equal(emptyTranspilePackages(cfg).includes("@local/three"), false);

		const app = `export default defineConfig({
	server: {
		prerender: {
			crawlLinks: true,
			ignore: ["/_/shop", "/_/shop/**"],
		},
		routeRules: {
			"/_/shop": {
				isr: { expiration: 60, allowQuery: ["collection", "sort", "after"] },
				headers: { "cache-control": "public, max-age=0, must-revalidate" },
			},
			"/_/shop/**": {
				isr: { expiration: 60 },
			},
			"/api/shopify/revalidate": { isr: false },
		},
	},
});
`;
		const next = stripShopifyConfig(app);
		assert.equal(next.includes("/_/shop"), false);
		assert.equal(next.includes("shopify"), false);
		assert.equal(next.includes("crawlLinks: true"), true);
	});

	it("strips unquoted solid/optimizeDeps three config", () => {
		const src = `export default defineConfig({
	// \`three\` is a large, plain-JS library
	solid: {
		exclude: [/[\\\\/]three@/],
	},
	vite: {
		optimizeDeps: {
			exclude: ["three"],
		},
	},
});
`;
		const next = stripThreeConfig(src);
		assert.equal(next.includes("solid:"), false);
		assert.equal(next.includes("optimizeDeps"), false);
		assert.equal(next.includes("vite:"), true);
	});

	it("removes the robots Link", () => {
		const src = `        <MetaProvider>
          <Link
            rel="robots"
            type="text/plain"
            href="/api/robots.txt"
          />

          <Nav />
`;
		assert.equal(removeRobotsLink(src).includes("robots"), false);
		assert.equal(removeRobotsLink(src).includes("<Nav />"), true);
	});
});
