import { cacheShort } from "../cache";
import { storefrontFetch } from "../client";
import { GET_SEARCH } from "../graphql/queries";
import type { Connection, ProductCard, RawConnection } from "../types";
import { reshapeConnection } from "../utils/reshape";

export async function searchProducts(
	query: string,
	first = 12,
): Promise<Connection<ProductCard>> {
	const { data } = await storefrontFetch<{
		search: RawConnection<ProductCard>;
	}>({
		query: GET_SEARCH,
		variables: { query, first },
		cache: cacheShort,
		operationName: "SearchProducts",
	});

	return reshapeConnection(data.search);
}
