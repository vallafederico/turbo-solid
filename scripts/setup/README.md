# Starter setup wizard

Interactive script to strip this multi-stack starter down to just the pieces you
want. Run it once, right after cloning.

```bash
node scripts/setup/index.mjs        # or: pnpm scaffold
node scripts/setup/index.mjs --dry-run   # preview only, change nothing
node scripts/setup/index.mjs --yes       # take all defaults, no prompts
```

It runs with **zero dependencies** so it works before `pnpm install`.

## What it asks

| Question  | Choices                                  | Removes if not chosen                                        |
| --------- | ---------------------------------------- | ----------------------------------------------------------- |
| Framework | SolidStart / Next.js / Astro             | the other apps (`apps/solid`, `apps/next`, `apps/astro`; `packages/router` is Solid-only) |
| WebGL     | three.js / OGL / none                    | `packages/three`, `packages/ogl`, `packages/gl-context`     |
| Sanity    | yes / no                                 | `apps/cms`, `packages/sanity`, `scripts/sanity-yaml`, `scripts/sync-sanity` |
| SEO       | yes / no (Solid + Sanity only)           | `packages/seo`                                              |
| Shopify   | yes / no (Solid only)                    | `packages/shopify`                                         |
| Optimise  | yes / no                                 | `scripts/optimise`                                         |
| Placeholders | yes / no                              | empty stub dirs (`packages/animation`, `packages/types`, `packages/ui`) |

`packages/config`, `packages/tailwind`, and `packages/modules` are core and always kept.

## Shared frontend contract

All three apps keep the same creative-dev baseline (Study Hall / local Astro+Sanity):

| Feature | Solid | Next | Astro |
| --- | --- | --- | --- |
| Lenis smooth scroll | `src/lib/utils/scroll.ts` | `animation/useLenisRoot.ts` | `@local/modules` `createScroll` |
| Tailwind column grid | `@local/tailwind` + Shift+G | same | same (`Grid.astro` + Shift+G) |
| Page transitions | `@acme/router` dual-mount | `animation/page-transition.ts` | Taxi (`data-taxi` / `data-taxi-view`) |
| JS islands | Solid components | React components | `data-module` registry |
| Sanity | `@local/sanity` | `@local/sanity` | `@local/sanity/query` |

Astro is the MPA option: Taxi swaps `data-taxi-view`, modules mount on
`[data-module]`. Solid and Next keep SPA routers and do the same scroll / grid
work in framework code.

## What it does

1. Deletes every directory you didn't select.
2. Prunes `workspace:*` deps that point at removed packages from the remaining
   `package.json` files.
3. Removes framework-specific scripts from the root `package.json`.
4. Writes your answers to `.starter.json`.
5. Offers to run `pnpm install` to refresh the lockfile.

## What it does NOT do

It does **not** rewrite your source code. If a file you keep still imports a
package you removed, the wizard prints it as a warning so you can fix the import
by hand. Always run inside a clean git tree so you can `git checkout` to undo.
