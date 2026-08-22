# Astro app

MPA frontend for this starter. Same Sanity project, Tailwind grid, and Lenis
smooth scroll as Solid/Next — page changes go through Taxi, and JS islands
boot from `[data-module]`.

This is the stack used on [Study Hall](https://www.studyhall.design/): Astro
renders the document, Taxi swaps `data-taxi-view`, modules attach to
`data-module="…"`.

```bash
pnpm --filter astro dev
```

| Piece | Where |
| --- | --- |
| Taxi wrapper | `src/layouts/PageLayout.astro` (`data-taxi` / `data-taxi-view`) |
| Module registry | `src/js/modules/` |
| App boot | `src/js/app.ts` |
| Shared runtime | `@local/modules` |
| Sanity fetch | `@local/sanity/query` |
| Grid tokens | `@local/tailwind` (`w-grids-*`, `px-gx`, Shift+G overlay) |

Persistent chrome (nav, grid overlay) lives **outside** `data-taxi-view` so
Taxi does not remount it. Page modules (slider, etc.) are created on enter
and destroyed on leave.
