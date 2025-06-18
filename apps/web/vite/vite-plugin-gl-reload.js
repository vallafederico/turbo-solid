export default function glReloadPlugin() {
  return {
    name: "vite-plugin-gl-reload",
    handleHotUpdate({ file, server }) {
      // Check if the file is in the gl directory
      if (file.includes("/gl/")) {
        // Force a full page reload
        server.ws.send({
          type: "full-reload",
          path: "*",
        });
        return [];
      }
    },
  };
}
