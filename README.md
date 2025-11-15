# Turborepo x Solid Starter

## Styles
CSS uses rems and is base-10, not base-16 because math with 16 is dumb.

### Fluid Type
`apps/web/src/styles/fluid-type.css` controls the breakpoints for fluid type. 10px is 1:1 with Figma. To generate a new breakpoint set, ask Cursor: "Generate a new breakpoint set from X to Y, where (X or Y) is 10px", it will build a new point/slope formula for scaling between 2 points.

### Grid
**Grid Overlay**
Press Shift+G to toggle a grid overlay that matches Figma
**Grid Config**
`apps/web/src/styles/grid.css` is used to modify the grid columns, margins, and gutters

**Using in Tailwind**
Classes like `px-grid-3` (3 columns), `mx-margin-2` (2 margins), and `size-gutter-4` (4 gutters) are used to match the Figma grid.

- `margin` and `gutter` accept values 1–6
- `grid` supports values 1 up to `var(--grid-columns)`
- The `grid-contain` utility pins content to the maximum width defined by `var(--max-scaling-width)`


## CMS Integrations

### Filegen
`sanity-yaml` generates type definitions, frontend files, and sanity schemas with yaml and handlebars. [Docs](https://github.com/nathannye/sanity-yaml)

### Sanity.io

## SEO

**Sitemaps**
`@crawl-me-maybe/sitemap` generates sitemap via async functions at build time. [Docs](https://github.com/nathannye/crawl-me-maybe/tree/main/packages/sitemap)

**Schema Markup**





## Animation

**`requestAnimationFrame`**
A single Raf is created via class and subscribed to as needed with `useRaf` or `Raf.add()`.

## Event Listeners




# Stuffs



## Web
- [ ] Add examples to frontend
  - [ ] CMS Dynamic pages /article/(slug)
  - [ ] CMS SEO on all pages
  - [ ] CMS form fields example /forms
  - [ ] CMS Slices example /slices
  - [ ] /content needs tabs like animation and components
- [ ] Accordions with summary and details


### Lenis/Scroll
- [ ] Add resize subscriber for lenis so we can tie it to webgl

### Components
- [x] rework slider with smooothy

---

## CMS

- [x] add Vercel deploy (@nathan)
- [ ] add guides (@nathan)
- [x] forms (@nathan)
- [ ] seo fields (@nathan)
  - [ ] schema markup
  - [x] canonical
  - [x] robots.txt
- [x] FUCKING HELL CLEAN UP THE CONFIGURATION ISSUE SIN SANITY BITCH
- [x] remove schdules and clean up bar

### Packages

- [x] SIETAMP GENERATOR
- [x] Sanity Solid (@nathan)
  - [x] finish sanity setup
  - [x] add component for data fetching
  - [x] do the <Slices>

#### Future

- [ ] Ecommerce Package (Shopify Utils) (eventually)
- [ ] localisation (eventually)
- [ ] get vercel analytics into sanity dashboard
- [ ] CWV
- [ ] Migration tools
  - [ ] push jsonnd to sanity
  - [ ] format from wordpress
  - [ ] format from webflow

### Scripts

- [ ] sanity importers
- [ ] sanity/web sync

---


-
