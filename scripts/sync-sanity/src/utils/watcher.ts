import { watch } from "fs";
import type { FSWatcher } from "fs";
import { join } from "path";
import { access } from "fs/promises";

interface WatcherHandlers {
  onNew: (
    filePath: string,
    filename: string,
    destination: string,
    entry: string
  ) => Promise<void>;
  onDelete: (filename: string, entry: string) => Promise<void>;
  onModify?: (filePath: string, destination: string) => Promise<void>;
}

interface WatcherConfig {
  entry: string;
  target: string;
}

export const createWatcher = (
  config: WatcherConfig,
  handlers: WatcherHandlers
) => {
  const processedFiles = new Set<string>();
  const path = join(process.cwd(), config.entry);

  const watcher = watch(
    path,
    { recursive: true },
    async (eventType, filename) => {
      if (!filename || filename === "index.ts") return;
      const filePath = join(process.cwd(), config.entry, filename);

      try {
        await access(filePath);
        if (eventType === "rename" && !processedFiles.has(filename)) {
          await handlers.onNew(filePath, filename, config.target, config.entry);
        } else if (processedFiles.has(filename) && handlers.onModify) {
          await handlers.onModify(filePath, config.target);
        }
        processedFiles.add(filename);
      } catch {
        processedFiles.delete(filename);
        await handlers.onDelete(filename, config.entry);
        console.log(`File deleted: ${filename.split("/").pop()}`);
      }
    }
  );

  return {
    close: () => {
      watcher.close();
      processedFiles.clear();
    },
    watcher,
  };
};
