import { describe, expect, it } from "vitest";
import { dedupeFragments } from "./graphql";

const MONEY = `fragment Money on MoneyV2 { amount currencyCode }`;
const IMAGE = `fragment Image on Image { url altText }`;

describe("dedupeFragments", () => {
	it("removes duplicate fragment definitions by name", () => {
		const query = `
      query Get {
        product { ...Money ...Image }
      }
      ${MONEY}
      ${IMAGE}
      ${MONEY}
      ${IMAGE}
    `;

		const result = dedupeFragments(query);
		expect(result.match(/fragment Money on/g)?.length).toBe(1);
		expect(result.match(/fragment Image on/g)?.length).toBe(1);
		expect(result).toContain("query Get");
		expect(result).toContain("...Money");
	});

	it("keeps nested braces intact and leaves single fragments untouched", () => {
		const query = `query Q { a { b { c } } } ${MONEY}`;
		expect(dedupeFragments(query)).toBe(query);
	});
});
