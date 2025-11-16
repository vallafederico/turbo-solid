import type { APIEvent } from "@solidjs/start/server";

export async function GET({ params }: APIEvent) {
	const { type } = params;

	const base = "https://example.com";

	const datasets: Record<string, { url: string; updated: string }[]> = {
		pages: [
			{ url: `${base}/`, updated: "2025-10-17" },
			{ url: `${base}/about`, updated: "2025-10-16" },
		],
		posts: [
			{ url: `${base}/blog/post-1`, updated: "2025-10-10" },
			{ url: `${base}/blog/post-2`, updated: "2025-10-08" },
		],
	};

	const entries = datasets[type];
	if (!entries) return new Response("Not Found", { status: 404 });

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(p) => `<url>
  <loc>${p.url}</loc>
  <lastmod>${p.updated}</lastmod>
</url>`,
	)
	.join("\n")}
</urlset>`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
}
