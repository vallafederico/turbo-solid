import {
	createStorefrontApiClient,
	type ApiVersion,
} from "@shopify/storefront-api-client";

const apiVersion =
	process.env.VITE_SHOPIFY_API_VERSION || ("2025-07" as ApiVersion);

const publicAccessToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;

const privateAccessToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

const storeDomain =
	process.env.SHOPIFY_STORE_DOMAIN || "https://ak-customs-llc.myshopify.com";

export const SHOPIFY_CLIENT = createStorefrontApiClient({
	publicAccessToken,
	storeDomain,
	apiVersion,
});
