// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";
import glsl from "vite-plugin-glsl";

// vite/vite-plugin-gl-reload.js
function glReloadPlugin() {
  return {
    name: "vite-plugin-gl-reload",
    handleHotUpdate({ file, server }) {
      if (file.includes("/gl/")) {
        server.ws.send({
          type: "full-reload",
          path: "*"
        });
        return [];
      }
    }
  };
}

// ../../packages/seo/sitemap/index.ts
import fs from "node:fs";
import path from "node:path";

// ../../packages/seo/sitemap/utils.ts
function createSitemapXml(urls) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const items = urls.map(
    (u) => `<url><loc>${u.url}</loc><lastmod>${u.updated ?? now}</lastmod></url>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}
function createIndexSitemap(files, baseUrl) {
  const items = files.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
}
function createRobotsTxt(indexUrl) {
  return `User-agent: *
Allow: /
Sitemap: ${indexUrl}
`;
}
async function getUrlsForGroup(name, patterns) {
  const urls = await Promise.all(
    patterns.map(async (pattern) => {
      const response = await fetch(`${pattern}`);
      const data = await response.json();
      return data;
    })
  );
  return urls;
}

// ../../packages/seo/sitemap/index.ts
var sampleConfg = {
  sitemaps: {
    pages: ["/", "/about/*"],
    posts: ["/blog/*"]
  }
};
function sitemapPlugin(config = sampleConfg) {
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      const outDir = path.resolve(process.cwd(), "dist");
      fs.mkdirSync(outDir, { recursive: true });
      const allSitemaps = [];
      for (const [name, patterns] of Object.entries(config.sitemaps)) {
        const urls = await getUrlsForGroup(name, patterns);
        const xml = createSitemapXml(urls);
        const filename = `sitemap-${name}.xml`;
        fs.writeFileSync(path.join(outDir, filename), xml);
        allSitemaps.push(filename);
      }
      const indexXml = createIndexSitemap(
        allSitemaps,
        "https://yourdomain.com"
      );
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), indexXml);
      const robotsTxt = createRobotsTxt("https://yourdomain.com/sitemap.xml");
      fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt);
      console.log(
        `\u2705 Generated ${allSitemaps.length} sitemaps + index + robots.txt`
      );
    }
  };
}

// app.config.ts
var plugins = [
  glsl({
    include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
    exclude: void 0,
    warnDuplicatedImports: true,
    defaultExtension: "glsl",
    minify: false,
    watch: true,
    root: "/"
  }),
  sitemapPlugin({
    sitemaps: {
      pages: ["/", "/about/*"],
      posts: ["/blog/*"]
    }
  }),
  solidSvg({
    defaultAsComponent: true
    // svgo: {
    //   enabled: false,
    //   svgoConfig: {
    //     plugins: [
    //       {
    //         name: "preset-default",
    //         params: {
    //           overrides: {
    //             removeUselessDefs: false,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // },
  }),
  sitemap,
  // Add our custom GL reload plugin
  glReloadPlugin()
];
var app_config_default = defineConfig({
  server: {
    prerender: {
      // routes: ["/"],
      crawlLinks: true
    }
  },
  vite: {
    plugins
  }
  // solid: {
  //   hot: false,
  // },
});
export {
  app_config_default as default
};
