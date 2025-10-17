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
import fs2 from "node:fs";
import path2 from "node:path";

// ../../packages/seo/sitemap/utils.ts
import fs from "node:fs";
import path from "node:path";
async function createSitemapXml(urls, opts) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let imageNS = false;
    let videoNS = false;
    const items = urls.map((u) => {
      let xml = `<url><loc>${u.url}</loc><lastmod>${u.lastmod ?? now}</lastmod>`;
      if (u.changefreq) {
        xml += `<changefreq>${u.changefreq}</changefreq>`;
      }
      if (typeof u.priority === "number") {
        xml += `<priority>${u.priority.toFixed(1)}</priority>`;
      }
      if (u.imageUrls?.length) {
        imageNS = true;
        for (const img of u.imageUrls) {
          xml += `<image:image><image:loc>${img}</image:loc></image:image>`;
        }
      }
      if (u.videoUrls?.length) {
        videoNS = true;
        for (const vid of u.videoUrls) {
          xml += `<video:video><video:content_loc>${vid}</video:content_loc></video:video>`;
        }
      }
      xml += "</url>";
      return xml;
    }).join("");
    const ns = [
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      imageNS ? 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : null,
      videoNS ? 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"' : null
    ].filter(Boolean).join(" ");
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${ns}>${items}</urlset>`;
    if (opts?.minify) {
      try {
        const { minify } = await import("minify-xml");
        xmlString = minify(xmlString);
      } catch (e) {
        throw new Error(
          `Sitemap XML minification failed: ${e instanceof Error ? e.message : String(e)}`
        );
      }
    }
    return xmlString;
  } catch (err) {
    throw new Error(
      `Sitemap XML creation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
async function createIndexSitemap(files, baseUrl, opts) {
  try {
    const items = files.map((f) => `<sitemap><loc>${baseUrl}/${f}</loc></sitemap>`).join("");
    let xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
    if (opts?.minify) {
      try {
        const { minify } = await import("minify-xml");
        xmlString = minify(xmlString);
      } catch (e) {
        throw new Error(
          `Sitemap index minification failed: ${e instanceof Error ? e.message : String(e)}`
        );
      }
    }
    return xmlString;
  } catch (err) {
    throw new Error(
      `Sitemap index XML creation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
var createFile = (outputPath, filename, content) => {
  try {
    fs.writeFileSync(path.join(outputPath, filename), content);
  } catch (err) {
    throw new Error(
      `Failed to write file ${filename} to ${outputPath}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
};

// ../../packages/seo/robots/index.ts
var DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
`;

// ../../packages/seo/sitemap/index.ts
var sampleConfig = {
  outDir: "dist",
  domain: "https://yourdomain.com",
  minify: true,
  sitemaps: {
    pages: async () => [
      { url: "/", updated: "2025-10-17" },
      { url: "/about", updated: "2025-10-16" }
    ],
    posts: async () => [
      { url: "/blog/post-1", updated: "2025-10-10" },
      { url: "/blog/post-2", updated: "2025-10-08" }
    ]
  },
  robots: async () => DEFAULT_ROBOTS_TXT
};
function sitemapPlugin(config = sampleConfig) {
  const domain = config?.domain;
  if (!domain) {
    throw new Error("Domain is required for sitemap generation");
  }
  const outDir = config?.outDir || "dist";
  const createRobots = async (sitemapsUrls = ["/sitemap.xml"]) => {
    let userRobots = DEFAULT_ROBOTS_TXT;
    if (config.robots && typeof config.robots === "function") {
      try {
        const result = await config.robots();
        if (typeof result === "string") {
          userRobots = result;
        }
      } catch (err) {
        console.warn("[SEO] Error in user robots async callback", err);
      }
    }
    let content = userRobots.trim();
    if (!content.endsWith("\n")) content += "\n";
    const domainUrl = domain.endsWith("/") ? domain.slice(0, -1) : domain;
    for (const rel of sitemapsUrls) {
      content += `Sitemap: ${domainUrl}${rel.startsWith("/") ? rel : `${"/"}${rel}`}
`;
    }
    createFile(outDir, "robots.txt", content);
  };
  const createSitemap = async (filename, urls) => {
    const xml = await createSitemapXml(urls, { minify: config?.minify });
    createFile(outDir, `${filename}.xml`, xml);
  };
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      const outDir2 = path2.resolve(process.cwd(), config?.outDir || "dist");
      fs2.mkdirSync(outDir2, { recursive: true });
      const { sitemaps } = config;
      if (typeof sitemaps === "function") {
        const urls = await sitemaps();
        await createSitemap("sitemap.xml", urls);
        await createRobots(["/sitemap.xml"]);
        console.log("\u2705 Generated single sitemap");
        return;
      }
      const allSitemaps = [];
      for (const [name, cb] of Object.entries(sitemaps)) {
        if (typeof cb !== "function") continue;
        const urls = await cb();
        await createSitemap(`sitemap-${name}.xml`, urls);
        allSitemaps.push(`/sitemap-${name}.xml`);
      }
      const indexXml = await createIndexSitemap(
        allSitemaps.map((s) => s.slice(1)),
        domain,
        { minify: config?.minify }
      );
      createFile(outDir2, "sitemap.xml", indexXml);
      await createRobots(["/sitemap.xml", ...allSitemaps]);
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
