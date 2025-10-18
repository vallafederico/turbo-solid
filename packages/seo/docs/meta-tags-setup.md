# SolidStart Meta Tags Setup

## Overview

This guide explains how to properly set up SEO meta tags in SolidStart to ensure they render correctly during SSR (Server-Side Rendering).

## The Problem

Meta tags in SolidStart must be rendered **synchronously during SSR** for search engines to index them properly. If you wrap meta tags in `<Show>` or render them after async data fetches, they won't be in the initial HTML response that crawlers see.

## The Solution

### 1. Route-Level Data Loading

Use SolidStart's `route.load()` function to preload all SEO-related data:

```typescript
// apps/web/src/routes/your-page.tsx
import { SanityMeta } from "@local/seo";
import type { PageMetadata, SeoDefaults } from "@local/seo";
import { createAsync } from "@solidjs/router";
import { getDocumentByType, getSeoDefaults, getSchemaDefaults } from "@local/sanity";

/**
 * Preload all data needed for SSR meta tags
 * This ensures meta tags are rendered synchronously during initial page load
 */
export const route = {
  load: () => Promise.all([
    getSeoDefaults(),      // Global SEO defaults
    getSchemaDefaults(),   // Schema markup defaults
    getDocumentByType("yourPageType"), // Page-specific data
  ]),
};

export default function YourPage() {
  // All data is preloaded, so these resolve immediately during SSR
  const seoDefaults = createAsync(() => getSeoDefaults());
  const schemaDefaults = createAsync(() => getSchemaDefaults());
  const pageData = createAsync(() => getDocumentByType("yourPageType"));

  return (
    <div>
      {seoDefaults() && pageData() && (
        <SanityMeta 
          pageData={pageData() as PageMetadata} 
          seoDefaults={seoDefaults() as SeoDefaults}
          schemaDefaults={schemaDefaults()}
        />
      )}
      
      {/* Your page content */}
    </div>
  );
}
```

### 2. Cached Queries

The SEO defaults are cached using SolidStart's `cache()` function, so they're only fetched once per request and shared across all pages:

```typescript
// packages/sanity/utils/seo-queries.ts
import { cache } from "@solidjs/router";
import { getDocumentByType } from "./query";

export const getSeoDefaults = cache(async () => {
  return getDocumentByType("seoDefaults");
}, "seo-defaults");

export const getSchemaDefaults = cache(async () => {
  return getDocumentByType("schemaMarkupDefaults");
}, "schema-defaults");
```

## Architecture

### Data Flow

```
Route Load
  ↓
getSeoDefaults() --------→ Cached globally
getSchemaDefaults() -----→ Cached globally
getDocumentByType() -----→ Page-specific data
  ↓
createAsync() resolves immediately during SSR
  ↓
SanityMeta component receives resolved data
  ↓
buildSeoPayload() merges defaults with page data
  ↓
Meta tags render synchronously
  ↓
Search engines see complete meta tags in HTML
```

### Merge Hierarchy

1. **Global Defaults** (`seoDefaults`)
   - Site-wide SEO settings
   - Fetched once per request via cache
   - Examples: siteTitle, pageTitleTemplate, siteUrl

2. **Type Defaults** (`schemaDefaults`) [Optional]
   - Content type-specific defaults
   - Examples: Article publisher, Product brand

3. **Page Metadata** (`pageData.metadata`)
   - Individual page overrides
   - Highest priority
   - Examples: Custom description, canonical URL

## Key Files

### Queries
- `packages/sanity/utils/seo-queries.ts` - Cached queries for shared data
- `packages/sanity/utils/query.ts` - Base query utilities

### Components
- `packages/seo/components/SanityMeta.tsx` - Meta tag renderer
- Accepts resolved data as props (no internal fetching)

### Utilities
- `packages/seo/build.ts` - Builds complete SEO payload
- `packages/seo/utils/merge.ts` - Merges defaults with page data

### Types
- `PageMetadata` - Page-level metadata structure
- `SeoDefaults` - Global SEO defaults structure
- `MergedMetadata` - Final merged result

## Benefits

✅ **SEO-friendly**: Meta tags in initial HTML response  
✅ **Performance**: Cached queries prevent redundant fetches  
✅ **Type-safe**: Full TypeScript support  
✅ **Maintainable**: Centralized SEO logic  
✅ **Flexible**: Easy to add page-specific overrides  

## Common Patterns

### Home Page
```typescript
export const route = {
  load: () => Promise.all([
    getSeoDefaults(),
    getSchemaDefaults(),
    getDocumentByType("home"),
  ]),
};
```

### Dynamic Page (with slug)
```typescript
export const route = {
  load: ({ params }) => Promise.all([
    getSeoDefaults(),
    getSchemaDefaults(),
    getDocumentBySlug("article", params.slug),
  ]),
};
```

### Page with No CMS Data
```typescript
export const route = {
  load: () => Promise.all([
    getSeoDefaults(),
    getSchemaDefaults(),
  ]),
};

// Provide static page metadata
const pageData: PageMetadata = {
  title: "Contact Us",
  metadata: {
    description: "Get in touch with our team",
  },
};
```

## Anti-Patterns

❌ **Don't wrap meta tags in `<Show>`**
```typescript
// BAD - Meta tags won't be in SSR HTML
<Show when={seoDefaults()}>
  <SanityMeta ... />
</Show>
```

❌ **Don't fetch data inside meta component**
```typescript
// BAD - Async fetch delays meta tag rendering
export default function SanityMeta() {
  const data = createAsync(() => getSeoDefaults());
  // Meta tags render after data loads
}
```

❌ **Don't skip route.load()**
```typescript
// BAD - Data not preloaded for SSR
export default function Page() {
  const data = createAsync(() => getSeoDefaults());
  // Data might not be ready during SSR
}
```

## Troubleshooting

### Meta tags not showing in view-source
- Ensure `route.load()` is defined and preloads all data
- Check that queries are returning data (no errors)
- Verify conditional rendering doesn't hide meta tags

### Empty meta tag values
- Ensure page data structure matches `PageMetadata` type
- Check that field names match (use `metadata`, not `seo`)
- Verify defaults are fetched successfully

### TypeScript errors
- Import types from `@local/seo`: `PageMetadata`, `SeoDefaults`
- Use type assertions when needed: `as PageMetadata`
- Ensure conditional rendering checks data exists

