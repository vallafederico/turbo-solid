/* Sanity */

// export const sanityConfig = {
//   projectId: process.env.SANITY_PROJECT_ID,
//   dataset: process.env.SANITY_DATASET,
//   apiVersion: process.env.SANITY_API_VERSION,
//   useCdn: false,
// };

/* Scripts */

export const SANITY_SYNC_EMABLED = true;
export const SANITY_SYNC_ROUTES = [
  {
    path: "...",
    destination: "...",
  },
  {
    path: "/pages",
    destination: "...",
  },
];

export const IMAGE_OPTIMIZATION_ENABLED = true;
export const IMAGE_OPTIMIZATION_PATHS = ["/images/*"];
