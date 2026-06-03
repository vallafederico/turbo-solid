export type Money = {
	amount: string;
	currencyCode: string;
};

export type ShopifyImage = {
	url: string;
	altText?: string | null;
	width?: number | null;
	height?: number | null;
};

export type SelectedOption = {
	name: string;
	value: string;
};

export type SelectedOptionInput = {
	name: string;
	value: string;
};

export type ProductVariant = {
	id: string;
	title: string;
	availableForSale: boolean;
	price: Money;
	compareAtPrice?: Money | null;
	sku?: string | null;
	selectedOptions: SelectedOption[];
	image?: ShopifyImage | null;
	product?: { handle: string; title: string };
};

export type Swatch = {
	color?: string | null;
	image?: { previewImage?: { url: string } | null } | null;
};

export type ProductOptionValue = {
	name: string;
	firstSelectableVariant?: ProductVariant | null;
	swatch?: Swatch | null;
};

export type ProductOption = {
	name: string;
	optionValues: ProductOptionValue[];
};

export type ProductCard = {
	id: string;
	handle: string;
	title: string;
	featuredImage?: ShopifyImage | null;
	priceRange: {
		minVariantPrice: Money;
		maxVariantPrice: Money;
	};
};

export type ProductSeo = {
	title?: string | null;
	description?: string | null;
};

export type Product = ProductCard & {
	description?: string;
	descriptionHtml?: string;
	vendor?: string;
	productType?: string;
	tags?: string[];
	options?: ProductOption[];
	images?: ShopifyImage[];
	encodedVariantExistence?: string | null;
	encodedVariantAvailability?: string | null;
	selectedOrFirstAvailableVariant?: ProductVariant | null;
	adjacentVariants?: ProductVariant[];
	seo?: ProductSeo | null;
};

export type Collection = {
	id: string;
	handle: string;
	title: string;
	description?: string;
	image?: ShopifyImage | null;
};

export type PageInfo = {
	hasNextPage: boolean;
	endCursor?: string | null;
};

export type Connection<T> = {
	nodes: T[];
	pageInfo: PageInfo;
};

export type ProductSortKey =
	| "TITLE"
	| "PRICE"
	| "BEST_SELLING"
	| "CREATED_AT"
	| "ID"
	| "RELEVANCE"
	| "UPDATED_AT";

/** Sort keys for `collection.products` — differs from `ProductSortKeys` (e.g. `CREATED` not `CREATED_AT`). */
export type ProductCollectionSortKey =
	| "TITLE"
	| "PRICE"
	| "BEST_SELLING"
	| "CREATED"
	| "ID"
	| "RELEVANCE"
	| "MANUAL"
	| "COLLECTION_DEFAULT";

export type GetProductsOptions = {
	first?: number;
	after?: string | null;
	sortKey?: ProductSortKey;
	reverse?: boolean;
};

export type GetCollectionProductsOptions = {
	handle: string;
	first?: number;
	after?: string | null;
	/** Accepts catalog sort keys; mapped to `ProductCollectionSortKeys` before the API call. */
	sortKey?: ProductSortKey;
	reverse?: boolean;
};

export type CartLineCost = {
	totalAmount: Money;
	amountPerQuantity?: Money;
	compareAtAmountPerQuantity?: Money | null;
};

export type CartLineMerchandise = {
	id: string;
	title: string;
	availableForSale: boolean;
	price: Money;
	compareAtPrice?: Money | null;
	requiresShipping?: boolean;
	selectedOptions?: SelectedOption[];
	image?: ShopifyImage | null;
	product: { title: string; handle: string };
};

export type CartLine = {
	id: string;
	quantity: number;
	cost?: CartLineCost;
	merchandise: CartLineMerchandise;
};

export type CartDiscountCode = {
	code: string;
	applicable: boolean;
};

export type Cart = {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	note?: string | null;
	discountCodes?: CartDiscountCode[];
	cost: {
		subtotalAmount: Money;
		totalAmount: Money;
	};
	lines: CartLine[];
};

export type UserError = {
	field?: string[] | null;
	message: string;
};

export type CartLineInput = {
	merchandiseId: string;
	quantity: number;
};

export type CartLineUpdateInput = {
	id: string;
	quantity: number;
};

export type CartMutationResult = {
	cart: Cart | null;
	userErrors: UserError[];
};

export type SearchResult = {
	products: Connection<ProductCard>;
};

export type StorefrontCost = {
	requestedQueryCost?: number;
	actualQueryCost?: number;
	throttleStatus?: {
		maximumAvailable: number;
		currentlyAvailable: number;
		restoreRate: number;
	};
};

export type StorefrontFetchResult<T> = {
	data: T;
	cost?: StorefrontCost;
};

export type RawConnection<T> = {
	edges?: { node: T; cursor?: string }[];
	nodes?: T[];
	pageInfo?: PageInfo;
};

export type RawCartLine = {
	id: string;
	quantity: number;
	cost?: CartLineCost;
	merchandise: CartLineMerchandise;
};

export type RawCart = {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	note?: string | null;
	discountCodes?: CartDiscountCode[];
	cost: {
		subtotalAmount: Money;
		totalAmount: Money;
	};
	lines: RawConnection<RawCartLine>;
};
