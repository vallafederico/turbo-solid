# Stuffs

## Web

## CMS

- [ ] add Vercel deploy
- [ ] add guides

## Packages

- [ ] Sanity Solid
- [ ] Ecommerce Package (Shopify Utils)
- [ ] Solid Hooks (?)
- [ ] localisation

## Scripts

- [ ] sanity importers
- [ ] sanity/web sync

---

### Sanity/web sync

- Creates new component in /web based on name of sanity schema
  - if you change the component in sanity you only override the props so you get type error but the component doesn't break
  - find a fix for custom types

```tsx
interface SliceNameProps {
  SLICE_PROP_1: "from sanity";
  SLICE_PROP_2: "from sanity" || any;
}

export default function SliceName({
  SLICE_PROP_1,
  SLICE_PROP_2,
}: SliceNameProps) {
  return <section class="px-gx py-gy">slice name</section>;
}

```

- Registers in the respective index.ts the files and puts it into an array
- register it to pageSlices

- if it's a page, create a new page + sanity query with the corresponding name

- Auto fill files if you create it inside /slices or inside /pages

---
