# Schema Markup References (@id)

## Overview

The schema markup system uses JSON-LD `@id` properties to create efficient references between entities. Instead of repeating full Person or Organization schemas in multiple places, entities are defined once with an `@id`, and then referenced by that ID elsewhere.

## How @id References Work

### Example: Article with Author and Publisher

**Without References (redundant):**
```json
[
  {
    "@type": "Article",
    "author": {
      "@type": "Person",
      "name": "John Doe",
      "url": "https://example.com/authors/john"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Example Corp",
      "logo": "https://example.com/logo.png"
    }
  }
]
```

**With References (efficient):**
```json
[
  {
    "@type": "Organization",
    "@id": "https://example.com#organization-example-corp",
    "name": "Example Corp",
    "logo": "https://example.com/logo.png"
  },
  {
    "@type": "Person",
    "@id": "https://example.com/blog/my-article#person-john-doe",
    "name": "John Doe",
    "url": "https://example.com/authors/john"
  },
  {
    "@type": "Article",
    "author": { "@id": "https://example.com/blog/my-article#person-john-doe" },
    "publisher": { "@id": "https://example.com#organization-example-corp" }
  }
]
```

## Automatic @id Generation

The system automatically generates `@id` values when not provided, **using the page's canonical URL as the base**:

### For Organizations
```typescript
// Input (on page: https://example.com/about)
{ name: "Example Corp" }

// Generated @id
"https://example.com/about#organization-example-corp"

// Or if organization has url property:
{ name: "Example Corp", url: "https://example.com" }

// Generated @id
"https://example.com#organization-example-corp"
```

### For Persons
```typescript
// Input (on page: https://example.com/blog/post-1)
{ name: "John Doe" }

// Generated @id
"https://example.com/blog/post-1#person-john-doe"
```

### Custom @id
```typescript
// You can provide custom @id values (relative or absolute)

// Relative (will be prefixed with base URL)
{
  "@id": "#contributor-jane-smith",
  name: "Jane Smith"
}
// Result: "https://example.com/page#contributor-jane-smith"

// Absolute (will be used as-is)
{
  "@id": "https://example.com/people/jane-smith",
  name: "Jane Smith"
}
// Result: "https://example.com/people/jane-smith"
```

## Entity Collection and Output

The `composeSchema` function automatically:

1. **Collects all entities** with `@id` from various sources:
   - `schemaDefaults.organization`
   - `schemaDefaults.publisher`
   - `extra.author[]`
   - `extra.contributor[]`
   - `extra.organizer[]`
   - `extra.performer[]`
   - `extra.brand`

2. **Outputs entities first** as full schemas with all properties

3. **References entities** in parent schemas using just `{ "@id": "..." }`

4. **Deduplicates** - each entity with the same `@id` is only output once

## Schema Types That Support References

### Person
Used in:
- Article `author`
- Article `contributor`
- Event `organizer`
- Event `performer`
- AboutPage `about`

Properties:
- `@id` - Unique identifier (auto-generated or custom)
- `name` - Person's name (required)
- `url` - Website or profile URL
- `sameAs` - Social profile URLs
- `jobTitle` - Job title/role
- `image` - Photo URL

### Organization
Used in:
- Article `publisher`
- Product `brand`
- Event `organizer`
- WebSite `publisher`
- AboutPage `about`
- Schema defaults
- Organization `department` (nested organizations)

Properties:
- `@id` - Unique identifier (auto-generated or custom)
- `name` - Organization name (required)
- `url` - Website URL
- `logo` - Logo image URL
- `sameAs` - Social profile URLs
- `department` - Array of sub-organizations/departments (optional)
- `contactPoint` - Array of contact information objects (optional)

**Contact Point Structure**:
```typescript
{
  contactType: string;        // "customer service", "sales", "support"
  telephone?: string;         // Phone with country code
  email?: string;             // Email address
  url?: string;               // Contact page URL
  areaServed?: string[];      // Geographic areas: ["US", "CA"]
  availableLanguage?: string[]; // Languages: ["English", "Spanish"]
}
```

**Note**: Organizations can have nested departments and contact points, which are automatically processed and output correctly in the schema markup.

## Usage Examples

### Article with Multiple Authors

```typescript
buildSeoPayload({
  schemaDefaults: {
    organization: {
      "@id": "#org-acme",
      name: "ACME Publishing",
      logo: "https://acme.com/logo.png"
    }
  },
  pageSchemaType: "Article",
  extraSchemaData: {
    author: [
      {
        "@id": "#author-john",
        name: "John Doe",
        jobTitle: "Senior Editor",
        url: "https://acme.com/authors/john"
      },
      {
        "@id": "#author-jane",
        name: "Jane Smith",
        jobTitle: "Contributing Writer"
      }
    ],
    _createdAt: "2024-01-01",
    _updatedAt: "2024-01-15"
  }
});
```

**Output:**
```json
[
  {
    "@type": "Organization",
    "@id": "https://acme.com#org-acme",
    "name": "ACME Publishing",
    "logo": "https://acme.com/logo.png"
  },
  {
    "@type": "Person",
    "@id": "https://acme.com/blog/article#author-john",
    "name": "John Doe",
    "jobTitle": "Senior Editor",
    "url": "https://acme.com/authors/john"
  },
  {
    "@type": "Person",
    "@id": "https://acme.com/blog/article#author-jane",
    "name": "Jane Smith",
    "jobTitle": "Contributing Writer"
  },
  {
    "@type": "Article",
    "author": [
      { "@id": "https://acme.com/blog/article#author-john" },
      { "@id": "https://acme.com/blog/article#author-jane" }
    ],
    "publisher": { "@id": "https://acme.com#org-acme" }
  }
]
```

### Event with Organizer and Performers

```typescript
buildSeoPayload({
  pageSchemaType: "Event",
  extraSchemaData: {
    name: "Tech Conference 2024",
    startDate: "2024-06-15",
    organizer: [
      {
        "@id": "#org-techconf",
        name: "TechConf Organization",
        url: "https://techconf.org"
      }
    ],
    performer: [
      {
        "@id": "#speaker-alice",
        name: "Alice Johnson",
        jobTitle: "CTO"
      },
      {
        "@id": "#speaker-bob",
        name: "Bob Williams",
        jobTitle: "CEO"
      }
    ]
  }
});
```

**Output:**
```json
[
  {
    "@type": "Organization",
    "@id": "#org-techconf",
    "name": "TechConf Organization",
    "url": "https://techconf.org"
  },
  {
    "@type": "Person",
    "@id": "#speaker-alice",
    "name": "Alice Johnson",
    "jobTitle": "CTO"
  },
  {
    "@type": "Person",
    "@id": "#speaker-bob",
    "name": "Bob Williams",
    "jobTitle": "CEO"
  },
  {
    "@type": "Event",
    "name": "Tech Conference 2024",
    "startDate": "2024-06-15",
    "organizer": [{ "@id": "#org-techconf" }],
    "performer": [
      { "@id": "#speaker-alice" },
      { "@id": "#speaker-bob" }
    ]
  }
]
```

### Product with Brand

```typescript
buildSeoPayload({
  schemaDefaults: {
    product: {
      brand: {
        "@id": "#brand-acme",
        name: "ACME Products",
        logo: "https://acme.com/brand-logo.png"
      }
    }
  },
  pageSchemaType: "Product",
  extraSchemaData: {
    name: "Super Widget",
    price: 99.99,
    sku: "WIDGET-001"
  }
});
```

**Output:**
```json
[
  {
    "@type": "Organization",
    "@id": "https://example.com#brand-acme",
    "name": "ACME Products",
    "logo": "https://acme.com/brand-logo.png"
  },
  {
    "@type": "Product",
    "name": "Super Widget",
    "brand": { "@id": "https://example.com#brand-acme" },
    "price": 99.99,
    "sku": "WIDGET-001"
  }
]
```

### Organization with Departments

```typescript
buildSeoPayload({
  schemaDefaults: {
    organization: {
      "@id": "https://acme.com#organization",
      name: "ACME Corporation",
      url: "https://acme.com",
      logo: "https://acme.com/logo.png",
      department: [
        {
          "@id": "#engineering",
          name: "Engineering Department",
          url: "https://acme.com/engineering"
        },
        {
          "@id": "#marketing",
          name: "Marketing Department",
          url: "https://acme.com/marketing"
        }
      ]
    }
  },
  pageSchemaType: "WebPage",
  pageSeo: {
    title: "About ACME",
    metadata: {
      description: "Learn about ACME Corporation"
    }
  }
});
```

**Output:**
```json
[
  {
    "@type": "Organization",
    "@id": "https://acme.com#organization",
    "name": "ACME Corporation",
    "url": "https://acme.com",
    "logo": "https://acme.com/logo.png",
    "department": [
      { "@id": "https://acme.com#engineering" },
      { "@id": "https://acme.com#marketing" }
    ]
  },
  {
    "@type": "Organization",
    "@id": "https://acme.com#engineering",
    "name": "Engineering Department",
    "url": "https://acme.com/engineering"
  },
  {
    "@type": "Organization",
    "@id": "https://acme.com#marketing",
    "name": "Marketing Department",
    "url": "https://acme.com/marketing"
  },
  {
    "@type": "WebSite",
    "@id": "https://example.com#website",
    "publisher": { "@id": "https://acme.com#organization" }
  },
  {
    "@type": "WebPage",
    "name": "About ACME"
  }
]
```

## Benefits

1. **Reduced Redundancy** - Each entity defined once, referenced many times
2. **Cleaner Markup** - Easier to read and maintain
3. **Better SEO** - Google prefers this pattern for complex schemas
4. **Consistency** - Entity data is consistent across all references
5. **Flexibility** - Easy to share entities across multiple pages

## Best Practices

1. **Use consistent @id format** - Stick to `#type-name` pattern
2. **Provide @id in Sanity** - For frequently used entities (authors, organizations)
3. **Let system auto-generate** - For one-off entities
4. **Share entities across pages** - Store common entities in `schemaDefaults`
5. **Use meaningful names** - Make @id values human-readable
6. **Leverage department hierarchies** - Use the `department` field to create organizational structures
7. **Consider nested departments** - Departments can have their own departments for complex hierarchies
8. **Add contact points** - Include `contactPoint` arrays for customer service, sales, support contacts
9. **Use specific page types** - Use AboutPage and ContactPage instead of generic WebPage when appropriate

## Implementation Details

### Builder Functions

All entity builders support a second parameter `asReference`:

```typescript
buildPersonSchema(person, false)  // Full schema with @id
buildPersonSchema(person, true)   // Just { "@id": "..." }

buildOrgSchema(org, false)        // Full schema with @id
buildOrgSchema(org, true)         // Just { "@id": "..." }
```

### Compose Function Flow

```
1. Collect all entities (Person, Organization) from:
   - schemaDefaults (including nested departments)
   - extra data (authors, contributors, etc.)
   
2. Recursively process organizations with departments:
   - Add parent organization as entity
   - Add each department as separate entity
   - Departments can have their own departments (infinite nesting)
   
3. Build full schemas for each entity with @id

4. Build page schema (Article, Event, etc.) with references

5. Output: [entities..., pageSchema]
```

### Department Handling

Organizations with `department` fields are processed recursively:

1. **Parent organization** is added as full entity
2. **Each department** is added as separate entity with full schema
3. **Department references** in parent use `{ "@id": "..." }`
4. **Nested departments** are processed recursively
5. **Deduplication** prevents duplicate entities with same `@id`

This allows for complex organizational hierarchies like:
```
ACME Corporation
  ├── Engineering
  │   ├── Frontend Team
  │   └── Backend Team
  └── Marketing
      ├── Content Team
      └── Social Media Team
```

### ID Normalization

The `normalizeId` function creates valid IDs from names:

```typescript
normalizeId("John Doe")           // "john-doe"
normalizeId("ACME Corp!")         // "acme-corp"
normalizeId("Jane O'Brien")       // "jane-obrien"
```

### Base URL Logic

- **For Person entities**: Uses the page's canonical URL as base
  - `https://example.com/blog/post-1#person-john-doe`
  
- **For Organization entities**: Prefers organization's URL, falls back to page URL
  - If org has `url: "https://acme.com"` → `https://acme.com#organization-acme`
  - Otherwise → `https://example.com/page#organization-acme`

- **Custom @id values**:
  - Absolute URLs (starting with `http`) → used as-is
  - Relative IDs (starting with `#`) → prefixed with base URL

