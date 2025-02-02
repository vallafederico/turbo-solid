import blocks from "./blocks";
import pages from "./pages";
import settings from "./settings";
import slices from "./slices";
import taxonomies from "./taxonomies";

export const schemaTypes = [...blocks, ...taxonomies, ...slices, ...pages, ...settings ]
