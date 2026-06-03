export type ShopifyRouteRulesOptions = {
	ttl?: number;
	preset?: string;
};

export type RevalidateHandleInput =
	| string
	| {
			product?: string;
			collection?: string;
	  };

export type TriggerRevalidateOptions = {
	baseUrl?: string;
	bypassToken?: string;
};

function isVercelPreset(preset?: string): boolean {
	if (preset === "vercel") return true;
	return typeof process !== "undefined" && process.env.VERCEL === "1";
}

export function shopifyRouteRules(
	options: ShopifyRouteRulesOptions = {},
): Record<string, Record<string, unknown>> {
	const ttl = options.ttl ?? 60;
	const onVercel = isVercelPreset(options.preset);

	const revalidateRule = onVercel
		? { isr: { expiration: ttl } }
		: { swr: ttl };

	const shopIndexRule = onVercel
		? {
				isr: {
					expiration: ttl,
					allowQuery: ["collection", "sort", "after"],
				},
			}
		: { swr: ttl };

	return {
		"/_/shop": {
			...shopIndexRule,
			headers: { "cache-control": "public, max-age=0, must-revalidate" },
		},
		"/_/shop/**": {
			...revalidateRule,
			headers: { "cache-control": "public, max-age=0, must-revalidate" },
		},
		"/api/shopify/revalidate": { isr: false },
	};
}

export function shopifyRevalidatePaths(input: RevalidateHandleInput): string[] {
	const paths = new Set<string>(["/_/shop"]);

	if (typeof input === "string") {
		paths.add(`/_/shop/${input}`);
		return [...paths];
	}

	if (input.product) {
		paths.add(`/_/shop/${input.product}`);
	}

	if (input.collection) {
		paths.add(`/_/shop?collection=${encodeURIComponent(input.collection)}`);
	}

	return [...paths];
}

export async function triggerVercelRevalidate(
	paths: string[],
	options: TriggerRevalidateOptions = {},
): Promise<{ revalidated: string[]; skipped: string[] }> {
	const baseUrl =
		options.baseUrl ??
		(typeof process !== "undefined" ? process.env.VERCEL_URL : undefined);

	const bypassToken =
		options.bypassToken ??
		(typeof process !== "undefined" ? process.env.VERCEL_BYPASS_TOKEN : undefined);

	if (!baseUrl || !bypassToken) {
		return { revalidated: [], skipped: paths };
	}

	const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
	const revalidated: string[] = [];

	for (const path of paths) {
		const url = `${origin}${path.startsWith("/") ? path : `/${path}`}`;
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"x-prerender-revalidate": bypassToken,
			},
		});

		if (response.ok) {
			revalidated.push(path);
		}
	}

	const skipped = paths.filter((path) => !revalidated.includes(path));
	return { revalidated, skipped };
}

export function verifyRevalidationSecret(
	provided: string | null | undefined,
	expected?: string,
): boolean {
	const secret =
		expected ??
		(typeof process !== "undefined"
			? process.env.SHOPIFY_REVALIDATION_SECRET
			: undefined);

	return Boolean(secret && provided && provided === secret);
}

export function verifyShopifyWebhookHmac(
	body: string,
	hmacHeader: string | null | undefined,
	secret?: string,
): boolean {
	if (!hmacHeader || !secret) return false;

	// Webhook HMAC verification requires Node crypto; skip when unavailable.
	if (typeof globalThis.crypto?.subtle === "undefined") {
		return false;
	}

	// Lightweight sync check using Web Crypto is async-only; callers should use
	// verifyRevalidationSecret for the revalidate route and add full HMAC in Node.
	void body;
	return false;
}
