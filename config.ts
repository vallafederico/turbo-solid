/* Sanity */

// export const sanityConfig = {
//   projectId: process.env.SANITY_PROJECT_ID,
//   dataset: process.env.SANITY_DATASET,
//   apiVersion: process.env.SANITY_API_VERSION,
//   useCdn: false,
// };

// //////////////////////////////////

/* image optim */
export const IMAGE_OPTIMIZATION_ENABLED = true;
export const IMAGE_OPTIMIZATION_PATHS = ["/images/*"];

/* sanity sync */
export const SANITY_SYNC_ENABLED = true;
export const SANITY_SYNC_FOLDERS = [
  /* base path is ./  */
  {
    entry: "/apps/cms/schemas/slices",
    target: "/apps/web/src/components/slices",
  },
];
