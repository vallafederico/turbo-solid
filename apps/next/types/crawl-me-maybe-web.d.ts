declare module "@crawl-me-maybe/web" {
  export function buildSeoPayload(options: {
    pageSeo?: unknown;
    globalDefaults: unknown;
    schemaDefaults?: unknown;
    pageSchemaType?: string;
    seoFieldName?: string;
    isHomepage?: boolean;
    extraSchemaData?: Record<string, unknown>;
    projectId?: string;
    dataset?: string;
  }): {
    meta: {
      title?: string;
      description?: string;
      canonicalUrl?: string;
      robots?: string;
      favicons?: Array<{
        href: string;
        type?: string;
        sizes?: string;
      }>;
    };
    schemas: unknown[] | undefined;
  };
}
