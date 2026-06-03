import { cacheLong, cacheNone, cacheShort } from "../cache";
import { storefrontFetch } from "../client";
import {
	GET_COLLECTION_BY_HANDLE,
	GET_COLLECTION_PRODUCTS,
	GET_COLLECTIONS,
} from "../graphql/queries";
import type {
	Collection,
	Connection,
	GetCollectionProductsOptions,
	ProductCard,
	RawConnection,
} from "../types";
import { reshapeConnection, reshapeProduct } from "../utils/reshape";

export async function getCollections(
	first = 20,
): Promise<Connection<Collection>> {
	const { data } = await storefrontFetch<{
		collections: RawConnection<Collection>;
	}>({
		query: GET_COLLECTIONS,
		variables: { first },
		cache: cacheLong,
		operationName: "GetCollections",
	});

	return reshapeConnection(data.collections);
}

export async function getCollection(
	handle: string,
): Promise<Collection | null> {
	const { data } = await storefrontFetch<{ collection: Collection | null }>({
		query: GET_COLLECTION_BY_HANDLE,
		variables: { handle },
		cache: cacheLong,
		operationName: "GetCollectionByHandle",
	});

	return data.collection;
}

export async function getCollectionProducts({
	handle,
	first = 12,
	after = null,
	sortKey = "BEST_SELLING",
	reverse = false,
}: GetCollectionProductsOptions): Promise<{
	collection: Collection | null;
	products: Connection<ProductCard>;
}> {
	const { data } = await storefrontFetch<{
		collection:
			| (Collection & { products: RawConnection<ProductCard> })
			| null;
	}>({
		query: GET_COLLECTION_PRODUCTS,
		variables: { handle, first, after, sortKey, reverse },
		cache: cacheShort,
		operationName: "GetCollectionProducts",
	});

	if (!data.collection) {
		return { collection: null, products: reshapeConnection(null) };
	}

	const { products, ...collection } = data.collection;
	return {
		collection,
		products: reshapeConnection(products),
	};
}
