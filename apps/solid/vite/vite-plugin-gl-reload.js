import path from "node:path";
import { fileURLToPath } from "node:url";

const normalize = (filePath) => filePath.replace(/\\/g, "/");
const currentDir = path.dirname(fileURLToPath(import.meta.url));

export default function glReloadPlugin() {
  const packagePath = normalize(path.resolve(currentDir, "../../packages/three"));
  const isWebglPackageFile = (file) => normalize(file).includes("/packages/three/");

  return {
    name: "vite-plugin-gl-reload",
    configureServer(server) {
      // Ensure Vite watcher listens for workspace package changes too.
      server.watcher.add(packagePath);

      const triggerFullReload = (file) => {
        if (!isWebglPackageFile(file)) return;
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      };

      server.watcher.on("add", triggerFullReload);
      server.watcher.on("change", triggerFullReload);
      server.watcher.on("unlink", triggerFullReload);
    },
    handleHotUpdate({ file, server }) {
      if (!isWebglPackageFile(file)) return;

      server.ws.send({
        type: "full-reload",
        path: "*",
      });
      return [];
    },
  };
}
