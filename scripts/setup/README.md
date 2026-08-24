# Starter setup wizard

Interactive script to strip this multi-stack starter down to the pieces you
want. Run it once, right after cloning.

```bash
pnpm setup                      # or: pnpm scaffold
pnpm setup --dry-run            # preview only, change nothing
pnpm setup --yes                # take all defaults, no prompts
```

On a TTY it uses **arrow keys** to move, **space** to toggle extras, and
**enter** to confirm. Piped input falls back to numbered choices and y/n.

It runs with **zero dependencies** so it works before `pnpm install`.

## What it asks

| Question | Choices | Removes if not chosen |
| --- | --- | --- |
| Framework | SolidStart / Next.js / Astro | the other apps (`packages/router` is Solid-only) |
| CMS | Sanity / None | `apps/cms`, `packages/sanity`, sync scripts, content routes, slices, preview/robots APIs; home pages become static |
| WebGL | three.js / none (OGL if `packages/ogl` exists) | `packages/three`, `packages/gl-context`, webgl routes, canvas wiring, `clientRectGl` |
| Extras | SEO (Solid + Sanity), Shopify (Solid), image/font optimise | matching packages, `/_/shop`, `@local/seo` usage, `scripts/optimise` |

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

1. Deletes unused apps, packages, and feature files (routes, slices, shop, canvas).
2. Rewrites kept source so removed packages are not imported (nav links, home pages, canvas, SEO tags).
3. Prunes `workspace:*` deps and leftover npm deps (`three`, …) from remaining manifests.
4. Removes framework-specific scripts from the root `package.json`.
5. Writes your answers to `.starter.json`.
6. Offers to run `pnpm install` to refresh the lockfile.

Always run inside a clean git tree so you can `git checkout` to undo.
