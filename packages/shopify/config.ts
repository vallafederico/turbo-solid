export type ShopifyConfig = {
	endpoint: string;
	token: string;
	apiVersion: string;
	storeDomain: string;
	companyName: string;
	siteName: string;
	revalidationSecret: string;
};

function readEnv(key: string, fallback = ""): string {
	if (typeof process !== "undefined" && process.env?.[key]) {
		return process.env[key]!;
	}
	return fallback;
}

export function resolveEndpoint(domain: string, apiVersion: string): string {
	if (domain === "mock.shop") {
		return "https://mock.shop/api";
	}
	return `https://${domain}/api/${apiVersion}/graphql.json`;
}

export function getShopifyConfig(
	env: Record<string, string | undefined> = typeof process !== "undefined"
		? process.env
		: {},
): ShopifyConfig {
	const storeDomain = env.SHOPIFY_STORE_DOMAIN ?? "mock.shop";
	const apiVersion = env.SHOPIFY_API_VERSION ?? "2025-01";
	const token = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";

	return {
		endpoint: resolveEndpoint(storeDomain, apiVersion),
		token,
		apiVersion,
		storeDomain,
		companyName: env.COMPANY_NAME ?? "Mock Shop",
		siteName: env.SITE_NAME ?? "Mock Shop",
		revalidationSecret: env.SHOPIFY_REVALIDATION_SECRET ?? "mock-secret",
	};
}
