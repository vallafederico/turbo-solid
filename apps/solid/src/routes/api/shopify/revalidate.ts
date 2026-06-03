import {
	shopifyRevalidatePaths,
	triggerVercelRevalidate,
	verifyRevalidationSecret,
} from "@local/shopify";
import type { APIEvent } from "@solidjs/start/server";

type RevalidateBody = {
	product?: string;
	collection?: string;
	handle?: string;
};

export async function POST({ request }: APIEvent) {
	const secret =
		request.headers.get("x-shopify-revalidation-secret") ??
		new URL(request.url).searchParams.get("secret");

	if (!verifyRevalidationSecret(secret)) {
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	}

	let body: RevalidateBody = {};
	try {
		body = (await request.json()) as RevalidateBody;
	} catch {
		body = {};
	}

	const handle = body.handle ?? body.product ?? body.collection;
	const paths = shopifyRevalidatePaths(
		body.product || body.collection
			? { product: body.product, collection: body.collection }
			: (handle ?? ""),
	);

	const { revalidated, skipped } = await triggerVercelRevalidate(paths, {
		baseUrl: process.env.VERCEL_URL,
		bypassToken: process.env.VERCEL_BYPASS_TOKEN,
	});

	return new Response(
		JSON.stringify({ revalidated: true, paths, refreshed: revalidated, skipped }),
		{
			status: 200,
			headers: { "Content-Type": "application/json" },
		},
	);
}
