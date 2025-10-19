# SolidStart Meta Tags Setup

## Overview

This guide explains how to properly set up SEO meta tags in SolidStart to ensure they render correctly during SSR (Server-Side Rendering).

## The Problem

Meta tags in SolidStart must be rendered **synchronously during SSR** for search engines to index them properly. If you wrap meta tags in `<Show>` or render them after async data fetches, they won't be in the initial HTML response that crawlers see.

## The Solution

### 1. Route-Level Data Loading

Use SolidStart's `route.load()` function to preload page-specific data:

```typescript
// apps/web/src/routes/your-page.tsx
import { SanityMeta } from "@local/seo";
import type { PageMetadata } from "@local/seo";
import { createAsync } from "@solidjs/router";
import { getDocumentByType } from "@local/sanity";

/**
 * Preload page-specific data for SSR meta tags
 * SanityMeta fetches global defaults internally
 */
export const route = {
  load: () => getDocumentByType("yourPageType"),
};

export default function YourPage() {
  // Page data is preloaded, resolves immediately during SSR
  const pageData = createAsync(() => getDocumentByType("yourPageType"));

  return (
    <div>
      <SanityMeta pageData={pageData() as PageMetadata} />
      
      {/* Your page content */}
    </div>
  );
}
```

### 2. Internal Default Fetching

The `SanityMeta` component fetches global defaults internally using `createAsync` with `deferStream: true`. This means:

- **SEO defaults** (`seoDefaults`) and **schema defaults** (`schemaMarkupDefaults`) are fetched automatically
- No need to pass them as props
- They can be cached in Sanity queries for performance
- The component handles the data loading and merging automatically

```typescript
// Inside SanityMeta component
const seoDefaults = createAsync(() => getDocumentByType("seoDefaults"), {
  deferStream: true,
});

const schemaDefaults = createAsync(() => getDocumentByType("schemaMarkupDefaults"), {
  deferStream: true,
});
```

## Architecture

### Data Flow

```
Route Load
  ↓
getDocumentByType() -----→ Page-specific data preloaded
  ↓
SanityMeta component renders
  ├─→ createAsync() fetches seoDefaults (with deferStream)
  ├─→ createAsync() fetches schemaDefaults (with deferStream)
  └─→ Receives pageData as prop
  ↓
buildSeoPayload() merges defaults with page data
  ↓
Meta tags render during SSR
  ↓
Search engines see complete meta tags in HTML
```

### Merge Hierarchy

1. **Global Defaults** (`seoDefaults`)
   - Site-wide SEO settings
   - Fetched internally by SanityMeta
   - Examples: siteTitle, pageTitleTemplate, siteUrl

2. **Schema Defaults** (`schemaDefaults`)
   - Schema markup defaults
   - Fetched internally by SanityMeta
   - Examples: Organization, Publisher, WebSite data

3. **Page Metadata** (`pageData`)
   - Individual page content and overrides
   - Passed as prop to SanityMeta
   - Highest priority
   - Examples: Custom description, canonical URL, schema type

## Key Files

### Components
- `packages/seo/components/SanityMeta.tsx` - Main meta tag component
  - Fetches defaults internally
  - Accepts pageData and isHomepage props
  - Renders meta tags and schema markup

### Utilities
- `packages/seo/build.ts` - Builds complete SEO payload
- `packages/seo/utils/merge.ts` - Merges defaults with page data
- `packages/seo/utils/image.ts` - Image URL resolution and optimization

### Queries
- `packages/sanity/utils/query.ts` - Base query utilities
- `getDocumentByType()` - Used internally for defaults
- `getDocumentBySlug()` - Used for page-specific data

### Types
- `PageMetadata` - Page-level metadata structure
- `SeoDefaults` - Global SEO defaults structure  
- `SchemaDefaults` - Schema markup defaults structure
- `MergedMetadata` - Final merged result

## Benefits

✅ **SEO-friendly**: Meta tags in initial HTML response  
✅ **Simple API**: Only pass pageData, defaults fetched internally  
✅ **Performance**: Deferred streams and internal caching  
✅ **Type-safe**: Full TypeScript support  
✅ **Maintainable**: Centralized SEO logic in one component  
✅ **Flexible**: Easy to add page-specific overrides  
✅ **Auto-generated schemas**: WebSite schema automatic on homepage  

## Common Patterns

### Home Page
```typescript
import { SanityMeta } from "@local/seo";
import { createAsync } from "@solidjs/router";
import { getDocumentByType } from "@local/sanity";

export const route = {
  load: () => getDocumentByType("home"),
};

export default function HomePage() {
  const pageData = createAsync(() => getDocumentByType("home"));
  
  return (
    <div>
      <SanityMeta pageData={pageData()} isHomepage={true} />
      {/* Page content */}
    </div>
  );
}
```

### Dynamic Page (with slug)
```typescript
import { SanityMeta } from "@local/seo";
import { createAsync, useParams } from "@solidjs/router";
import { getDocumentBySlug } from "@local/sanity";

export const route = {
  load: ({ params }) => getDocumentBySlug("article", params.slug),
};

export default function ArticlePage() {
  const params = useParams();
  const pageData = createAsync(() => getDocumentBySlug("article", params.slug));
  
  return (
    <div>
      <SanityMeta pageData={pageData()} />
      {/* Article content */}
    </div>
  );
}
```

### Page with Static Metadata
```typescript
import { SanityMeta } from "@local/seo";
import type { PageMetadata } from "@local/seo";

// Static page metadata (no CMS data needed)
const pageData: PageMetadata = {
  title: "Contact Us",
  metadata: {
    description: "Get in touch with our team",
  },
};

export default function ContactPage() {
  return (
    <div>
      <SanityMeta pageData={pageData} />
      {/* Page content */}
    </div>
  );
}
```

## Anti-Patterns

❌ **Don't conditionally render SanityMeta based on pageData**
```typescript
// BAD - SanityMeta should always render, even without pageData
<Show when={pageData()}>
  <SanityMeta pageData={pageData()} />
</Show>

// GOOD - SanityMeta handles undefined pageData gracefully
<SanityMeta pageData={pageData()} />
```

❌ **Don't skip route.load() for CMS pages**
```typescript
// BAD - Page data not preloaded for SSR
export default function Page() {
  const data = createAsync(() => getDocumentByType("page"));
  return <SanityMeta pageData={data()} />;
}

// GOOD - Preload in route.load()
export const route = {
  load: () => getDocumentByType("page"),
};
```

❌ **Don't forget isHomepage flag**
```typescript
// BAD - Homepage won't get WebSite schema automatically
<SanityMeta pageData={homeData()} />

// GOOD - Set isHomepage for proper schema generation
<SanityMeta pageData={homeData()} isHomepage={true} />
```

## Troubleshooting

### Meta tags not showing in view-source
- Ensure `route.load()` preloads page-specific data
- Check that `getDocumentByType()` is returning data (no errors)
- Verify SanityMeta is not wrapped in conditional rendering
- Check browser console for Sanity query errors

### Empty meta tag values
- Ensure page data structure matches `PageMetadata` type
- Check that field names match (use `metadata`, not `seo`)
- Verify seoDefaults document exists in Sanity CMS
- Check that schemaMarkupDefaults document exists for schema markup

### WebSite schema not appearing on homepage
- Ensure `isHomepage={true}` is set on SanityMeta component
- Check that schemaDefaults are properly configured in Sanity

### TypeScript errors
- Import types from `@local/seo`: `PageMetadata`
- Use type assertions when needed: `as PageMetadata`
- Ensure pageData can be undefined: `pageData?: PageMetadata`

