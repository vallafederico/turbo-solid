/**
 * Framework-agnostic Sanity fetch helpers.
 * Safe to import from Astro / Node without pulling Solid or React UI.
 */
export { default as sanityClient } from "./client";
export { urlFor } from "./utils/assets";
export {
	getDocByType,
	getDocumentByType,
	getDocumentBySlug,
} from "./utils/query";
