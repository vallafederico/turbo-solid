# Turborepo x Solid Starter
Modular monorepo for building sites with Solid.js

## Table of Contents
- [Git Structure](#git-structure)
- [Organization](#organization)
  - [Solid Start](#solid-start)
  - [Optional packages](#optional-packages)
- [Slices vs Components](#slices-vs-components)
- [Styles](#styles)
  - [Fluid Type](#fluid-type)
  - [Grid](#grid)
- [Filegen](#filegen)
- [CMS Integration](#cms-integration)
  - [Sanity.io](#sanityio)
- [SEO](#seo)
- [Animation](#animation)
- [Resizing](#resizing)
- [Deployment](#deployment)

---

## Git Structure

```
├─ feat/<feature-name>
│
├─ fix/<fix-name>
|
main      (staging)
│
>> PR
│
prod      (live)
```
- `main`: All development is merged here, used for staging environments.
- `feat/`, `fix/`: Feature and fix branches are based off `main` and merged back when complete.
- `prod`: Only released, live-ready code is merged here (usually via PR from `main`).


## Organization
Optional groups of common components/functions are bumped into `pacakges` or `apps` so they can be removed/added per project.

### Solid Start
Solid Start is JSX without the opinions of Next. Things to be aware of:
- `map()` is not used to loop through components, use `<For/>` [Docs](https://docs.solidjs.com/reference/components/for)
- Conditional rendering is done with `<Show/>` not `&&` [Docs](https://docs.solidjs.com/reference/components/show)
- No keys are used on arrays
- State is created via `createSignal()`, Solid's version of `useState()` [Docs](https://docs.solidjs.com/concepts/signals)
- State updates do _not_ rerender entire components, only single DOM nodes. [Docs](https://docs.solidjs.com/concepts/intro-to-reactivity)

[Read full docs](https://docs.solidjs.com/)

### Optional packages
- Sanity
- Storybook (Solid)
- WebGL (Coming soon)
- UI (TBD)

---

## Slices vs Components
- **Components:** Smaller, composable elements like buttons or accordions
- **Slices:** CMS-matched sections or modules

---

## Styles
Spacing is base 10. `1rem = 10px` and can be used as `mt-10`, `px-33`, etc.

### Fluid Type
`apps/web/src/styles/fluid-type.css` controls the breakpoints for fluid type. 10px is 1:1 with Figma. To generate a new breakpoint set, ask Cursor: "Generate a new breakpoint set from X to Y, where (X or Y) is 10px", it will build a new point/slope formula for scaling between 2 points.

### Grid
**Grid Overlay**
Press x to toggle a grid overlay that matches Figma
**Grid Config**
`apps/web/src/styles/grid.css` is used to modify the grid columns, margins, and gutters

**Using in Tailwind**
Classes like `px-grid-3` (3 columns), `mx-margin-2` (2 margins), and `size-gutter-4` (4 gutters) are used to match the Figma grid.

- `margin` and `gutter` accept values 1–6
- `grid` supports values 1 up to `var(--grid-columns)`
- The `grid-contain` utility pins content to the maximum width defined by `var(--max-scaling-width)`

---

## Filegen
`sanity-yaml` generates type definitions, frontend files, and sanity schemas with yaml and handlebars. [Docs](https://github.com/nathannye/sanity-yaml)

From the project root, run `cd packages/sanity`, then `pnpm generate` once the yaml and handlebars files are correctly set up.

---

## CMS Integration

### Sanity.io
> Not using sanity? Remove `apps/cms` and `packages/sanity`, making sure to uninstall the latter from any packages.

Sanity is organized into 4 segments
- **blocks**: Groups of fields that get used in schemas (ex: rich text with specific settings)
- **slices**: Sections of a page
- **taxonomies**: Categorical items that get used as referneces
- **pages**: Self explanatory
- **settings**: Globals that affect multiple schema types/pages

#### Data Fetching
SanityPage wraps a show and passes the reactive result of a fetch into a function
```tsx
const getContent = async ()=>{
  "use server"
  // return your data
}

export default function Page() {
  const fetcher = createAsync(() => getContent());

  return (
    <SanityPage fetcher={fetcher}>
      {(data) => {
        return (
          <div use:animateAlpha>
            <SanityPageSlices slices={data().slices} />
          </div>
        );
      }}
    </SanityPage>
  );
}
```

---

## Storybook
> Not using storybook? remove `apps/storybook` and any .stories.tsx files inside of `packages/ui`

**Using effectively**
- Storybook should contain Component and Slices folders.
- Any string, and boolean fields should be avaialble as argument types and using mock data from `packges/mocks`
- Media fields should be static
- Storybook needs to help non-technically inclined users to find out what different verions of components look like. The end user is _not_ the developer.
- Developers _will_ use this to test edge cases though and play with components in isolation without page influence.

## SEO

**Metadata**
TBD

**Sitemaps & Robots**
`@crawl-me-maybe/sitemap` generates sitemaps and robots.txt via async functions at build time. [Docs](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap)

**Schema Markup**
TBD

---

## Animation

**`requestAnimationFrame`**
A single Raf is created via class and subscribed to as needed with `useRaf` or `Raf.add()`.

---

## Resizing
A single Resize Observer is created via class and subscribed to with `useWindowResize()` or `Resizer.add()`.

---

## Deployment

**Web**
Vercel is used for deploys, `vercel.json` controls the deployment of `apps/web`

**Storybook**
(Chroamtic TBD)

**ISR**
`apps/web/src/routes/api/revalidate.ts` contains ISR logic. Create a new deploy hook in Vercel and add the route prefixes.