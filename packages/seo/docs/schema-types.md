# Schema Markup Types

This document describes all available schema types and their usage.

## Available Schema Types

### 1. WebPage (default)
Basic page type for general content pages.

**Use for**: Landing pages, generic content pages
**Fields**:
- `name` - Page name (auto-mapped from title)
- `description` - Page description (auto-mapped from meta description)
- `url` - Page URL (auto-mapped from canonical URL)
- `image` - Page image
- `inLanguage` - Language code
- `datePublished` - Publication date
- `dateModified` - Last modified date
- `about` - Entities (Person/Organization) the page is about

**Example**:
```typescript
{
  pageSchemaType: "WebPage",
  pageSeo: {
    title: "Our Services",
    metadata: { description: "Learn about our services" }
  }
}
```

---

### 2. AboutPage
Specialized page for company/organization information.

**Use for**: About us pages, company info pages
**Fields**:
- All WebPage fields
- `about` - Entities the page describes (typically the organization)

**Example**:
```typescript
{
  pageSchemaType: "AboutPage",
  pageSeo: {
    title: "About ACME Corp",
    metadata: { description: "Learn about our company" }
  },
  extraSchemaData: {
    about: [
      {
        name: "ACME Corporation",
        url: "https://acme.com"
      }
    ]
  }
}
```

---

### 3. ContactPage
Specialized page for contact information.

**Use for**: Contact pages, get in touch pages
**Fields**:
- All WebPage fields (except `about`)

**Example**:
```typescript
{
  pageSchemaType: "ContactPage",
  pageSeo: {
    title: "Contact Us",
    metadata: { description: "Get in touch with our team" }
  }
}
```

**Note**: Pair with Organization `contactPoint` for complete contact schema:
```typescript
{
  schemaDefaults: {
    organization: {
      name: "ACME Corp",
      contactPoint: [
        {
          contactType: "customer service",
          telephone: "+1-555-123-4567",
          email: "support@acme.com"
        }
      ]
    }
  }
}
```

---

### 4. Article
Content articles, blog posts, news items.

**Use for**: Blog posts, news articles, editorial content
**Fields**:
- `headline` - Article headline (auto-mapped from title)
- `description` - Article description
- `image` - Featured image
- `author` - Array of Person/Organization
- `publisher` - Publishing organization
- `datePublished` - Publication date (auto-mapped from `_createdAt`)
- `dateModified` - Last modified date (auto-mapped from `_updatedAt`)
- `articleSection` - Category or section
- `mainEntityOfPage` - Canonical URL

**Example**:
```typescript
{
  pageSchemaType: "Article",
  extraSchemaData: {
    author: [
      { name: "John Doe", url: "https://acme.com/authors/john" }
    ],
    articleSection: "Technology"
  }
}
```

---

### 5. Product
Product pages for e-commerce.

**Use for**: Product listings, item pages
**Fields**:
- `name` - Product name
- `description` - Product description
- `image` - Product image
- `brand` - Brand organization
- `sku` - Stock keeping unit
- `mpn` - Manufacturer part number
- `gtin` - GTIN (8/12/13/14)
- `offers` - Price and availability
- `aggregateRating` - Customer ratings
- `review` - Customer reviews

**Example**:
```typescript
{
  pageSchemaType: "Product",
  extraSchemaData: {
    name: "Super Widget",
    sku: "WIDGET-001",
    price: 99.99,
    priceCurrency: "USD",
    brand: { name: "ACME Products" }
  }
}
```

---

### 6. Event
Event pages for happenings, conferences, meetups.

**Use for**: Event listings, conference pages, meetup pages
**Fields**:
- `name` - Event name
- `description` - Event description
- `startDate` - Start date/time (required)
- `endDate` - End date/time
- `location` - Event location (Place or VirtualLocation)
- `organizer` - Event organizer(s)
- `performer` - Event performer(s)
- `eventStatus` - Event status
- `eventAttendanceMode` - Online/Offline/Mixed
- `offers` - Ticket information

**Example**:
```typescript
{
  pageSchemaType: "Event",
  extraSchemaData: {
    name: "Tech Conference 2024",
    startDate: "2024-06-15T09:00:00",
    endDate: "2024-06-16T17:00:00",
    eventAttendanceMode: "OfflineEventAttendanceMode",
    location: {
      name: "Convention Center",
      address: "123 Main St, City, State"
    },
    organizer: [
      { name: "Tech Events Inc" }
    ]
  }
}
```

---

### 7. FAQPage
FAQ pages with question/answer pairs.

**Use for**: FAQ pages, Q&A pages
**Fields**:
- `name` - Page name
- `description` - Page description
- `mainEntity` - Array of FAQ items

**Example**:
```typescript
{
  pageSchemaType: "FAQPage",
  extraSchemaData: {
    mainEntity: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days..."
      },
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days..."
      }
    ]
  }
}
```

---

## Organization Contact Points

Organizations can include `contactPoint` arrays for detailed contact information:

**Fields**:
- `contactType` - Type of contact (required): "customer service", "sales", "support", etc.
- `telephone` - Phone number with country code
- `email` - Email address
- `url` - Contact form or page URL
- `areaServed` - Geographic areas served (e.g., ["US", "GB"])
- `availableLanguage` - Available languages (e.g., ["English", "Spanish"])

**Example**:
```typescript
{
  organization: {
    name: "ACME Corporation",
    contactPoint: [
      {
        contactType: "customer service",
        telephone: "+1-555-123-4567",
        email: "support@acme.com",
        areaServed: ["US", "CA"],
        availableLanguage: ["English", "French"]
      },
      {
        contactType: "sales",
        telephone: "+1-555-987-6543",
        email: "sales@acme.com",
        url: "https://acme.com/contact-sales"
      }
    ]
  }
}
```

---

## Auto-Mapping

Most schema types support automatic field mapping from page metadata:

| Schema Field | Auto-Mapped From | Can Disable |
|-------------|------------------|-------------|
| `name`/`headline` | Page title | `autoMap.title = false` |
| `description` | Meta description | `autoMap.description = false` |
| `image` | Meta image / imageFieldMapping | `autoMap.image = false` |
| `datePublished` | `_createdAt` | `autoMap.dates = false` |
| `dateModified` | `_updatedAt` | `autoMap.dates = false` |
| `author` | author array | `autoMap.authors = false` |

Disable auto-mapping in `schemaMarkupDefaults` if you want full manual control:

```typescript
{
  autoMap: {
    title: false,
    description: false,
    image: false,
    dates: false,
    authors: false
  }
}
```

---

## Type Selection

Set the schema type using the `pageSchemaType` parameter:

```typescript
buildSeoPayload({
  pageSchemaType: "Article",  // or "Product", "Event", etc.
  pageSeo: { ... },
  extraSchemaData: { ... }
})
```

Or in Sanity, use the `schemaMarkup` field on your page document to select the appropriate type.

---

## Best Practices

1. **Choose the most specific type** - Use AboutPage instead of WebPage for about pages
2. **Provide required fields** - Each type has fields that Google requires
3. **Use ContactPage + contactPoint** - Pair ContactPage with Organization contactPoint
4. **Test with Google's Rich Results Test** - Validate your markup
5. **Include images** - Most types benefit from images
6. **Set proper dates** - Use ISO 8601 format for all dates
7. **Be specific with contact types** - Use standard values: "customer service", "sales", "support"

