import { cacheShort } from "../cache";
import { storefrontFetch } from "../client";
import { GET_PRODUCT_BY_HANDLE, GET_PRODUCTS } from "../graphql/queries";
import type {
	Connection,
	GetProductsOptions,
	Product,
	ProductCard,
	RawConnection,
	SelectedOptionInput,
} from "../types";
import { reshapeConnection, reshapeProduct } from "../utils/reshape";

export async function getProducts({
	first = 12,
	after = null,
	sortKey = "BEST_SELLING",
	reverse = false,
}: GetProductsOptions = {}): Promise<Connection<ProductCard>> {
	const { data } = await storefrontFetch<{
		products: RawConnection<ProductCard>;
	}>({
		query: GET_PRODUCTS,
		variables: { first, after, sortKey, reverse },
		cache: cacheShort,
		operationName: "GetProducts",
	});

	return reshapeConnection(data.products);
}

export async function getProduct(
	handle: string,
	selectedOptions: SelectedOptionInput[] = [],
): Promise<Product | null> {
	const { data } = await storefrontFetch<{ product: Product | null }>({
		query: GET_PRODUCT_BY_HANDLE,
		variables: { handle, selectedOptions },
		cache: cacheShort,
		operationName: "GetProductByHandle",
	});

	if (!data.product) return null;

	const raw = data.product as Product & {
		images?: RawConnection<{
			url: string;
			altText?: string | null;
			width?: number | null;
			height?: number | null;
		}> | null;
	};

	return reshapeProduct(raw) as Product;
}
