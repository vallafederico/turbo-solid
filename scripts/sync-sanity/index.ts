import { SANITY_SYNC } from "../../config";
import { createWatcher } from "./src/utils/watcher";

import {
  handleNewFile,
  handleModifiedFile,
  handleDeletedFile,
} from "./src/slices";

import { handleNewPage, handleDeletedPage } from "./pages";

/////////////////////////////// config

if (!SANITY_SYNC.enabled) {
  console.log("␖ SANITY SYNC DISABLED");
  process.exit(0);
}

console.log("␖ SANITY SYNC WATCHING");

const PAGES_CONFIG = {
  entry: "../../apps/cms/schemas/pages",
  target: "../.." + SANITY_SYNC.pagesTarget,
};

const SLICES_CONFIG = {
  entry: "../../apps/cms/schemas/slices",
  target: "../.." + SANITY_SYNC.slicesTarget,
};

/////////////////////////////// watch slices

createWatcher(SLICES_CONFIG, {
  onNew: handleNewFile,
  onModify: handleModifiedFile,
  onDelete: handleDeletedFile,
});

/////////////////////////////// watch pages

createWatcher(PAGES_CONFIG, {
  onNew: handleNewPage,
  onDelete: handleDeletedPage,
});
