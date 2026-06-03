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
| Framework | SolidStart / Next.js                     | the other app (`apps/solid` ↔ `apps/next`, `packages/router` is Solid-only) |
| WebGL     | three.js / OGL / none                    | `packages/three`, `packages/ogl`, `packages/gl-context`     |
| Sanity    | yes / no                                 | `apps/cms`, `packages/sanity`, `scripts/sanity-yaml`, `scripts/sync-sanity` |
| SEO       | yes / no (Solid + Sanity only)           | `packages/seo`                                              |
| Shopify   | yes / no (Solid only)                    | `packages/shopify`                                         |
| Optimise  | yes / no                                 | `scripts/optimise`                                         |
| Placeholders | yes / no                              | empty stub dirs (`apps/astro`, `packages/animation`, `packages/types`, `packages/ui`) |

`packages/config` and `packages/tailwind` are core and always kept.

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
