# Schema Markup Implementation

## Overview

This document describes the implementation of the schema markup system for the SEO package. The system automatically generates JSON-LD schema markup based on Sanity data and SEO metadata.

## Architecture

### Core Components

1. **`composeSchema`** (`schema-markup/compose.ts`)
   - Main composition function that orchestrates schema generation
   - Accepts SEO metadata, schema defaults, and page type
   - Returns an array of schema objects ready for JSON-LD rendering
   - Automatically includes Organization and WebSite schemas when appropriate

2. **Builders** (`schema-markup/builders/`)
   - `buildWebPage`: Generates WebPage schema
   - `buildArticle`: Generates Article schema
   - `buildProduct`: Generates Product schema  
   - `buildEvent`: Generates Event schema
   - `buildFAQPage`: Generates FAQPage schema
   - `buildWebSite`: Generates WebSite schema with search action
   - `buildOrganization`: Generates Organization schema
   - `utils`: Helper functions for image URLs, person/org conversion, date formatting

3. **SchemaMarkup Component** (`schema-markup/SchemaMarkup.tsx`)
   - SolidJS component that renders schema markup as JSON-LD script tags
   - Accepts merged SEO data and schema defaults
   - Automatically generates multiple schema objects per page

## Data Flow

```
Sanity CMS Data
    ↓
getSchemaDefaults() → schemaMarkupDefaults document
getSeoDefaults() → seoDefaults document
    ↓
buildSeoPayload({
  globalDefaults,
  schemaDefaults,
  pageSeo,
  pageSchemaType,
  extraSchemaData
})
    ↓
composeSchema() → [schema objects]
    ↓
<SchemaMarkup /> → JSON-LD script tags
```

## Schema Types Supported

### 1. WebPage (default)
- Used for standard pages
- Includes: name, description, URL, image, dates, language

### 2. Article
- Used for blog posts, news articles
- Includes: headline, author(s), publisher, dates, article section
- Supports auto-mapping from page metadata

### 3. Product
- Used for product pages
- Includes: name, brand, SKU, offers, prices, ratings
- Supports automatic offer generation

### 4. Event
- Used for event pages
- Includes: name, dates, location, organizer, performer
- Supports online/offline/mixed attendance modes

### 5. FAQPage
- Used for FAQ pages
- Generates Question/Answer pairs from mainEntity array

## Auto-Mapping Features

The system supports automatic field mapping controlled by `schemaDefaults.autoMap`:

- **title**: Maps page title → schema name/headline
- **description**: Maps page description → schema description
- **image**: Automatically finds images from configurable field paths
- **dates**: Maps `_createdAt`/`_updatedAt` → datePublished/dateModified
- **authors**: Maps author array to Person schema

## Schema Defaults Structure

```typescript
{
  organization: SchemaOrganization,      // Default org for publisher
  publisher: SchemaOrganization,         // Overrides organization
  imageFallback: SchemaImage,           // Default image if none found
  imageFieldMapping: string[],          // Fields to search for images
  autoMap: {
    title: boolean,
    description: boolean,
    image: boolean,
    dates: boolean,
    authors: boolean
  },
  webSite: {
    name: string,
    searchAction: {
      target: string,                    // Search URL template
      queryInput: string                 // Query input requirement
    }
  },
  webPage: {
    inLanguage: string,
    primaryImageOfPage: SchemaImage
  },
  article: {
    publisher: SchemaOrganization,
    section: string                      // Default article section
  },
  product: {
    brand: SchemaOrganization,
    priceCurrency: string,
    availability: string
  },
  event: {
    eventAttendanceMode: string,
    organizer: SchemaOrganization
  }
}
```

## Usage Example

### In a SolidJS route

```tsx
import { SanityMeta } from "@local/seo";

export default function ArticlePage(props) {
  const article = createAsync(() => getArticle(props.params.slug));
  
  return (
    <>
      <SanityMeta
        pageData={{
          title: article().title,
          schemaMarkup: "article",
          metadata: {
            description: article().excerpt,
            metaImage: article().coverImage
          },
          _createdAt: article()._createdAt,
          _updatedAt: article()._updatedAt
        }}
      />
      
      <article>
        {/* Article content */}
      </article>
    </>
  );
}
```

### Direct usage

```tsx
import { SchemaMarkup } from "@local/seo";

<SchemaMarkup
  seo={mergedMetadata}
  schemaDefaults={schemaDefaults}
  type="product"
  extra={{
    price: 99.99,
    brand: { name: "Example Brand" },
    sku: "PROD-123"
  }}
/>
```

## Integration with Build Function

The `buildSeoPayload` function now generates schema markup:

```typescript
const { meta, schema } = buildSeoPayload({
  globalDefaults: seoDefaults,
  schemaDefaults: schemaMarkupDefaults,
  pageSeo: pageData,
  pageSchemaType: "article",
  extraSchemaData: {
    author: [{ name: "John Doe" }],
    _createdAt: "2024-01-01",
    _updatedAt: "2024-01-15"
  }
});

// meta = merged SEO metadata for meta tags
// schema = array of schema objects for JSON-LD
```

## Best Practices

1. **Always provide schema defaults** via `getSchemaDefaults()` query
2. **Use auto-mapping** when possible to reduce duplication
3. **Override defaults** only when page-specific data differs
4. **Validate schema** using Google's Rich Results Test
5. **Include Organization and WebSite** schemas on all pages
6. **Use appropriate schema type** based on content type

## Future Enhancements

- LocalBusiness schema support
- BreadcrumbList schema generation
- Review/Rating schema
- Video schema support
- Image auto-optimization for schema requirements

