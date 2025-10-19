# SEO Sitemap Plugin Docs

## Overview
A generic Node.js sitemap generation plugin for static sites and SSR apps. Outputs Google and SEO-friendly sitemap.xml and robots.txt files after build.

- **Framework-agnostic:** Works in any Node/Vite build script, not SolidJS-only.
- **Customizable:** Single-callback or multi-sitemap object config.
- **Fast:** Outputs static XML(s) to your `outDir`.

---

## Installation

Until this is published as a package, import locally:

```js
import sitemapPlugin from "../../packages/seo/sitemap"; // Adjust path as needed
```

---

## Config Options

| Name      | Type     | Required | Description                                                         |
|-----------|----------|----------|---------------------------------------------------------------------|
| domain    | string   | Yes      | The full site origin (e.g. `https://yoursite.com`); used in URLs    |
| outDir    | string   | No       | Directory for output files. Recommend `.vercel/output/static` for Vercel; defaults to `dist` |
| sitemaps  | Callback/Obj | Yes  | Your pages. See usage examples below                                |


### Recommended Vercel Output Directory
For Vercel static deployments:
```js
outDir: ".vercel/output/static"
```
This ensures generated files are available for routing.

---

## Usage: Single Sitemap (Callback)
For most sites (typically under 50,000 URLs):
```js
sitemapPlugin({
  domain: "https://yoursite.com",
  // Vercel output:
  outDir: ".vercel/output/static",

  // One big sitemap
  sitemaps: async () => [
    { url: "/", lastmod: "2025-01-01" },
    { url: "/about", lastmod: "2025-01-02" },
    // ...more entries
  ],
});
```
This writes `sitemap.xml` and `robots.txt` in `outDir`.

---

## Usage: Multi-Sitemap (Object)
If your site has *more than 50,000 URLs* (the maximum allowed per sitemap file by Google and other search engines), **do not split sitemaps arbitrarily by count**. Instead, split your sitemaps by logical content types—such as `pages`, `posts`, `products`, or other major sections of your site—using the object form:

```js
sitemapPlugin({
  domain: "https://yoursite.com",
  sitemaps: {
    pages: async () => [/* ... all core pages ... */],
    blog: async () => [/* ... blog posts ... */],
    products: async () => [/* ... product URLs ... */],
    // etc.
  },
});
```
- Outputs one `sitemap-*.xml` per key, plus a `sitemap.xml` index.
- This is best for very large or multi-sectioned sites, and makes it easier to debug SEO and manage crawl priorities.
- Each child sitemap can hold up to 50,000 URLs. If one section exceeds that, segment further (e.g. `posts-1`, `posts-2`).

### Why Not Arbitrary Splits?
Splitting purely by number (`sitemap-001.xml`, `sitemap-002.xml`) is discouraged: search engines and SEOs prefer semantically meaningful sitemaps (content type, section, language, etc), which helps with crawl diagnostics and priority.

---

## API: SitemapEntry
Each entry:
```
{
  url: string,       // e.g. "/blog/post-1"
  lastmod?: string,  // ISO or yyyy-mm-dd
  changefreq?: "always" | "hourly" | "daily" | ...
}
```

---

## Best Practices & Tips
- **Provide a valid `domain`** (with protocol and no trailing slash)
- **Use the single callback** unless your sitemap will exceed 50,000 URLs total or for a given content type
- **If over 50,000 URLs, split sitemaps by content type or site section—never by a blind limit per file**
- **Set `outDir`** for static host/adapter compatibility (e.g. `.vercel/output/static` for Vercel, `dist` for others)
- **Call from any Node build script** (Vite, Rollup, or custom)
- **robots.txt is always generated**

---

## Example: Minimal Setup
```js
import sitemapPlugin from "../../packages/seo/sitemap";

sitemapPlugin({
  domain: "https://mydomain.test",
  sitemaps: async () => [
    { url: "/" },
    { url: "/about" },
    // ...
  ],
  outDir: "dist", // or .vercel/output/static
});
```

---

## License
MIT. No tracking. No telemetry. Use and hack freely.
