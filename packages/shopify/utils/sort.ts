import type { ProductCollectionSortKey, ProductSortKey } from "../types";

/** Maps catalog `ProductSortKeys` to collection `ProductCollectionSortKeys`. */
export function toCollectionSortKey(
	sortKey: ProductSortKey = "BEST_SELLING",
): ProductCollectionSortKey {
	switch (sortKey) {
		case "CREATED_AT":
		case "UPDATED_AT":
			return "CREATED";
		case "TITLE":
		case "PRICE":
		case "BEST_SELLING":
		case "ID":
		case "RELEVANCE":
			return sortKey;
		default:
			return "BEST_SELLING";
	}
}
