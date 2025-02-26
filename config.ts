// //////////////////////////////////////// sanity

export const SANITY = {
  name: "starter",
  title: "Starter",
  projectId: "6mav93fo",
  dataset: "production",
};

// //////////////////////////////////////// scripts

export const OPTIMISE = {
  /* image optimiser */
  images: {
    enabled: true, // enable image optimization
    paths: ["/apps/web/public"], // paths to watch for changes
    extensions: [".png", ".jpg", ".jpeg"], // extensions to convert
    quality: 80, // quality of the converted images
  },
  /* font optimiser */
  fonts: {
    enabled: true, // enable font optimization
    paths: ["/apps/web/public"], // paths to watch for changes
    extensions: [".ttf", ".woff"], // extensions to convert
    target: "woff2", // target format
    subsets: ["latin"], // subsets to convert
  },
};

export const SANITY_SYNC = {
  enabled: true, // enable sanity sync
  slicesTarget: "/apps/web/src/components/slices", // target path for slices creation
  pagesTarget: "/apps/web/src/pages", // target path for pages creation
};
