import type { APIEvent } from "@solidjs/start/server";

// --- 1. Define routeResolver and FULL_REBUILD_DOCS ---
const routeResolver: Record<string, string> = {
	home: "/",
	"case-study": "/case/:slug",
};

const FULL_REBUILD_DOCS = ["header", "footer"];

const REBUILD_URL = ""; // replace me

// Helper: Replace params in a route with values from the body
function interpolateRoute(route: string, params: Record<string, any>) {
	return route.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => params[key] ?? "");
}

export async function POST({ request }: APIEvent) {
	const authHeader = request.headers.get("authorization") ?? "";
	const token = authHeader.replace("Bearer ", "").trim();

	if (token !== process.env.SANITY_REVALIDATE_TOKEN) {
		return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	// --- 2. Parse Incoming Webhook Body ---
	let body: { _id?: string; _type?: string; [key: string]: any } = {};
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ ok: false, error: "invalid json" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	if (!body._type) {
		return new Response(JSON.stringify({ ok: false, error: "missing type" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	let triggeredFullRebuild = false;
	let rebuildResponse: Response | undefined;

	// --- 3. Full Rebuild: if _type is in FULL_REBUILD_DOCS, trigger Vercel hook and exit ---
	if (FULL_REBUILD_DOCS.includes(body._type) && REBUILD_URL) {
		try {
			const rebuildRes = await fetch(REBUILD_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			triggeredFullRebuild = true;
			rebuildResponse = rebuildRes;
		} catch (err) {
			console.error("[ISR] Error triggering Vercel rebuild hook", err);
			return new Response(
				JSON.stringify({
					ok: false,
					error: "failed to trigger rebuild",
					details: String(err),
				}),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	}

	// --- 4. Determine Which Routes To Invalidate ---
	const paths: string[] = [];
	const routePattern = routeResolver[body._type];
	if (routePattern) {
		let path = routePattern;
		// Fill slug if present (support object or string slug)
		if (routePattern.includes(":slug")) {
			let slugVal = "";
			if (body.slug) {
				// Support both { slug: "value" } and { slug: { current: "value" } }
				if (typeof body.slug === "string") {
					slugVal = body.slug;
				} else if (typeof body.slug === "object" && body.slug.current) {
					slugVal = body.slug.current;
				}
			}
			path = interpolateRoute(routePattern, { slug: slugVal });
		}
		paths.push(path);
	}

	// --- 5. Invalidate Cached Pages (If On Vercel) ---
	if (!triggeredFullRebuild && paths.length) {
		try {
			for (const path of paths) {
				await fetch(new URL(path, request.url).toString(), {
					method: "HEAD",
				}).catch(() => {});
			}
		} catch (err) {
			console.error("[ISR] Error revalidating:", err);
		}
	}

	// --- 6. Log For Debug ---
	if (triggeredFullRebuild) {
		console.log(
			`[ISR] Triggered full rebuild via Vercel hook for type "${body._type}"`,
		);
	} else {
		console.log(`[ISR] Sanity webhook revalidated: ${paths.join(", ")}`);
	}

	// --- 7. Respond Cleanly ---
	return new Response(
		JSON.stringify({
			ok: true,
			revalidated: !triggeredFullRebuild,
			triggeredFullRebuild,
			vercelRebuildStatus: triggeredFullRebuild
				? rebuildResponse?.status
				: undefined,
			paths,
			message: triggeredFullRebuild
				? "Triggered Vercel build hook for full rebuild."
				: `Revalidated ${paths.length} routes`,
		}),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}
