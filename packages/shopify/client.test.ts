import { afterEach, describe, expect, it, vi } from "vitest";
import { storefrontFetch } from "./client";

describe("storefrontFetch", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.unstubAllEnvs();
	});

	it("throws on GraphQL errors", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({
					errors: [{ message: "Field error" }],
				}),
			}),
		);

		await expect(
			storefrontFetch({
				query: "{ shop { name } }",
				operationName: "Test",
			}),
		).rejects.toThrow("Shopify GraphQL error: Field error");
	});

	it("throws on network failures", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new Error("offline")),
		);

		await expect(
			storefrontFetch({
				query: "{ shop { name } }",
			}),
		).rejects.toThrow("Shopify Storefront fetch failed: offline");
	});

	it("omits token header for mock.shop by default", async () => {
		vi.stubEnv("SHOPIFY_STORE_DOMAIN", "mock.shop");
		vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "");

		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ data: { ok: true } }),
		});
		vi.stubGlobal("fetch", fetchMock);

		await storefrontFetch<{ ok: boolean }>({
			query: "{ products(first:1) { edges { node { id } } } }",
		});

		const [, init] = fetchMock.mock.calls[0];
		expect(init.headers["X-Shopify-Storefront-Access-Token"]).toBeUndefined();
	});

	it("includes token header for real Shopify domains", async () => {
		vi.stubEnv("SHOPIFY_STORE_DOMAIN", "example.myshopify.com");
		vi.stubEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN", "test-token");

		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ data: { ok: true } }),
		});
		vi.stubGlobal("fetch", fetchMock);

		await storefrontFetch<{ ok: boolean }>({
			query: "{ shop { name } }",
		});

		const [, init] = fetchMock.mock.calls[0];
		expect(init.headers["X-Shopify-Storefront-Access-Token"]).toBe("test-token");
	});
});
