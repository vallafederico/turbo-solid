import { cache } from "react";
import { buildSeoPayload } from "@crawl-me-maybe/web";
import { SANITY_CONFIG } from "@local/config";
import { getDocumentByType } from "@local/sanity/utils/query";

/** Same payload as Solid `SanityMeta` on the home route (see `apps/solid/src/routes/(home).tsx`). */
export const getHomeSeoPayload = cache(async () => {
  const [pageData, globalDefaults, schemaDefaults] = await Promise.all([
    getDocumentByType("home"),
    getDocumentByType("seoDefaults"),
    getDocumentByType("schemaMarkupDefaults"),
  ]);

  if (!globalDefaults) {
    return null;
  }

  const { meta, schemas } = buildSeoPayload({
    globalDefaults,
    seoFieldName: "ssss",
    schemaDefaults,
    pageSeo: pageData,
    pageSchemaType: pageData?.schemaMarkup?.type,
    extraSchemaData: {
      _createdAt: pageData?._createdAt,
      _updatedAt: pageData?._updatedAt,
    },
    isHomepage: true,
    projectId: SANITY_CONFIG.projectId,
    dataset: SANITY_CONFIG.dataset,
  });

  return { meta, schemas };
});
