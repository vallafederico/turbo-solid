# Logo Handling in Schema Markup

This document explains how logos are handled throughout the schema markup system, including the global logo fallback and image resolution utilities.

## Global Logo Field

A global logo can be set in the `schemaMarkupDefaults` document in Sanity. This logo will be used as a fallback for all `Organization` schemas that don't have their own logo specified.

### Setting the Global Logo

In Sanity Studio:
1. Navigate to **Schema Markup Defaults** (singleton document)
2. Under **Image & Media Fallbacks**
3. Upload a **Global Logo** image

This logo will be automatically applied to:
- The default organization
- The publisher organization
- Product brands (if no brand-specific logo is provided)
- Event organizers/performers (organizations without logos)
- Any other organization entities that lack a logo

## Logo Fallback Hierarchy

When building organization schemas, logos are resolved in the following order:

1. **Organization-specific logo** - If the organization document has its own logo
2. **Global logo** - The logo set in `schemaMarkupDefaults`
3. **Image fallback** - The general default image from `schemaMarkupDefaults`
4. **No logo** - The `logo` field is omitted from the schema

```typescript
// Example fallback chain in code:
logo: createSchemaImageObject(
  organization.logo,           // 1. Specific logo
  schemaDefaults?.logo ||      // 2. Global logo
  schemaDefaults?.imageFallback // 3. General fallback
)
```

## Image Resolution Utility

The system includes a powerful image resolution utility that handles multiple image formats:

### Supported Image Formats

1. **Plain URL strings**
   ```typescript
   "https://example.com/logo.png"
   ```

2. **Objects with url property**
   ```typescript
   { url: "https://example.com/logo.png" }
   ```

3. **Sanity image objects with asset references**
   ```typescript
   {
     asset: {
       _ref: "image-abc123...",
       // or
       _id: "image-xyz789..."
     }
   }
   ```

4. **Sanity image objects with resolved assets**
   ```typescript
   {
     asset: {
       url: "https://cdn.sanity.io/images/..."
     }
   }
   ```

### Using the Image Utility

#### In Backend (Sanity Plugin)

Sanity image objects are automatically handled:

```typescript
defineField({
  name: "logo",
  type: "image",
  // No extra configuration needed
})
```

#### In Frontend (Schema Builders)

The `resolveImageUrl` utility automatically handles all formats:

```typescript
import { resolveImageUrl } from "@local/seo/utils";

const logoUrl = resolveImageUrl(
  organization.logo,     // Any supported format
  schemaDefaults?.logo   // Fallback (also any format)
);
```

#### Creating Schema Images

If you need to create a schema-compatible image object:

```typescript
import { createSchemaImage } from "@local/seo/utils";

const schemaImage = createSchemaImage(
  sanityImageAssetObject,
  fallbackImage
);
// Returns: { url: "https://..." } or undefined
```

## Organization Logo Examples

### Example 1: Organization with Specific Logo

```typescript
{
  organization: {
    name: "ACME Corporation",
    url: "https://acme.com",
    logo: {
      asset: {
        _ref: "image-abc123..."
      }
    }
  }
}
```

Result:
```json
{
  "@type": "Organization",
  "@id": "https://acme.com#organization-acme-corporation",
  "name": "ACME Corporation",
  "url": "https://acme.com",
  "logo": "https://cdn.sanity.io/images/.../abc123.png"
}
```

### Example 2: Organization Using Global Logo

```typescript
// schemaMarkupDefaults has:
{
  logo: {
    asset: { _ref: "image-global-logo..." }
  }
}

// Organization without logo:
{
  organization: {
    name: "ACME Corporation",
    url: "https://acme.com"
    // No logo specified
  }
}
```

Result:
```json
{
  "@type": "Organization",
  "@id": "https://acme.com#organization-acme-corporation",
  "name": "ACME Corporation",
  "url": "https://acme.com",
  "logo": "https://cdn.sanity.io/images/.../global-logo.png"
}
```

### Example 3: Department with Parent Logo

Departments without their own logos inherit the global logo:

```typescript
{
  organization: {
    name: "ACME Corp",
    logo: { asset: { _ref: "parent-logo..." } },
    department: [
      {
        name: "Engineering",
        url: "https://acme.com/engineering"
        // No logo - will use global
      }
    ]
  }
}
```

Result:
```json
[
  {
    "@type": "Organization",
    "@id": "https://acme.com#organization-acme-corp",
    "name": "ACME Corp",
    "logo": "https://cdn.sanity.io/images/.../parent-logo.png",
    "department": [
      { "@id": "https://acme.com/engineering#organization-engineering" }
    ]
  },
  {
    "@type": "Organization",
    "@id": "https://acme.com/engineering#organization-engineering",
    "name": "Engineering",
    "url": "https://acme.com/engineering",
    "logo": "https://cdn.sanity.io/images/.../global-logo.png"
  }
]
```

## Technical Details

### Image Resolution Process

The `resolveImageUrl` function follows this logic:

1. **Check if image is a string** - Return as-is
2. **Check if image has url property** - Return the url
3. **Check if image has asset reference**:
   - If asset has url property, return it
   - If asset has _ref or _id, use Sanity's `urlFor` to build URL
4. **Apply fallback** - If primary image fails, repeat process with fallback
5. **Return undefined** - If all resolution attempts fail

### Integration with Sanity

The utility imports `urlFor` from `@local/sanity`:

```typescript
import { urlFor } from "@local/sanity";

// Inside resolveImage:
const builder = urlFor(image);
const url = builder.url();
```

This leverages Sanity's image URL builder to:
- Resolve asset references to CDN URLs
- Support image transformations (if configured)
- Handle different image formats
- Provide optimized image delivery

### Error Handling

Image resolution includes try-catch blocks to handle edge cases:

```typescript
try {
  const builder = urlFor(image);
  return builder.url();
} catch (err) {
  console.warn("Failed to resolve Sanity image URL:", err);
  return undefined;
}
```

This ensures that:
- Invalid image references don't crash the build
- Warnings are logged for debugging
- The schema can gracefully omit logos when resolution fails

## Best Practices

1. **Set a global logo** - Always configure the global logo in `schemaMarkupDefaults` for consistency
2. **Use high-quality images** - Logos should be clear and recognizable at various sizes
3. **Provide organization-specific logos** - Override the global logo for major entities (publisher, main organization)
4. **Square aspect ratio** - Google recommends square logos (1:1 ratio)
5. **Appropriate file format** - PNG with transparency or SVG work best
6. **Consistent branding** - Use the same logo across all organization references
7. **Test resolution** - Verify that Sanity image references resolve correctly

## Troubleshooting

### Logo Not Appearing

1. **Check Sanity image upload** - Ensure the image is properly uploaded in Sanity
2. **Verify asset reference** - Confirm the `asset._ref` or `asset._id` is present
3. **Check console for warnings** - Look for "Failed to resolve Sanity image URL" messages
4. **Test image URL builder** - Ensure `urlFor` is properly configured in `@local/sanity`

### Wrong Logo Appearing

1. **Check fallback hierarchy** - Verify the organization doesn't have its own logo set
2. **Inspect schema output** - Look at the generated JSON-LD to see which logo is used
3. **Clear cache** - If using SSG, regenerate pages to pick up new logos

### Performance Issues

1. **Use appropriate image sizes** - Don't upload unnecessarily large logos
2. **Enable Sanity CDN** - Ensure image URLs use Sanity's CDN
3. **Consider image transformations** - Use `urlFor` modifiers for optimized sizes

---

For more information on schema markup, see:
- [Schema Types](./schema-types.md)
- [Schema References](./schema-references.md)
- [Meta Tags Setup](./meta-tags-setup.md)

