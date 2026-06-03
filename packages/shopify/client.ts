import type { CachePreset } from "./cache";
import { cacheShort } from "./cache";
import { getShopifyConfig } from "./config";
import type { StorefrontCost, StorefrontFetchResult } from "./types";
import { dedupeFragments } from "./utils/graphql";

type GraphQLError = { message: string; extensions?: Record<string, unknown> };

type GraphQLResponse<T> = {
	data?: T;
	errors?: GraphQLError[];
	extensions?: { cost?: StorefrontCost };
};

export type StorefrontFetchOptions = {
	query: string;
	variables?: Record<string, unknown>;
	cache?: CachePreset;
	operationName?: string;
};

const isDev =
	typeof process !== "undefined" && process.env.NODE_ENV !== "production";

export async function storefrontFetch<T>(
	options: StorefrontFetchOptions,
): Promise<StorefrontFetchResult<T>> {
	const { endpoint, token } = getShopifyConfig();
	const { query, variables, cache = cacheShort, operationName } = options;

	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		Accept: "application/json",
	};

	if (token) {
		headers["X-Shopify-Storefront-Access-Token"] = token;
	}

	const start = Date.now();
	let response: Response;

	try {
		response = await fetch(endpoint, {
			method: "POST",
			headers,
			body: JSON.stringify({ query: dedupeFragments(query), variables }),
			cache: cache.mode === "none" ? "no-store" : undefined,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Network request failed";
		throw new Error(`Shopify Storefront fetch failed: ${message}`);
	}

	if (!response.ok) {
		throw new Error(
			`Shopify Storefront HTTP ${response.status}: ${response.statusText}`,
		);
	}

	const json = (await response.json()) as GraphQLResponse<T>;

	if (json.errors?.length) {
		const messages = json.errors.map((e) => e.message).join("; ");
		if (isDev) {
			console.error("[shopify] GraphQL errors:", {
				operationName,
				errors: json.errors,
				latencyMs: Date.now() - start,
			});
		}
		throw new Error(`Shopify GraphQL error: ${messages}`);
	}

	if (!json.data) {
		throw new Error("Shopify GraphQL response missing data");
	}

	if (isDev && json.extensions?.cost) {
		console.debug("[shopify] query cost:", {
			operationName,
			cost: json.extensions.cost,
			latencyMs: Date.now() - start,
		});
	}

	return {
		data: json.data,
		cost: json.extensions?.cost,
	};
}
