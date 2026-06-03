import {
	getCollectionProducts,
	getCollections,
	getProducts,
	type ProductSortKey,
} from "@local/shopify";
import { Meta, Title } from "@solidjs/meta";
import {
	A,
	createAsync,
	query,
	useLocation,
	useSearchParams,
} from "@solidjs/router";
import { For, Show } from "solid-js";
import ProductCardLink from "~/components/shop/ProductCardLink";

type ShopGridParams = {
	collection?: string;
	sort?: string;
	after?: string;
};

const SORT_OPTIONS: { label: string; value: string; sortKey: ProductSortKey; reverse: boolean }[] = [
	{ label: "Best selling", value: "best-selling", sortKey: "BEST_SELLING", reverse: false },
	{ label: "Price: Low to High", value: "price-asc", sortKey: "PRICE", reverse: false },
	{ label: "Price: High to Low", value: "price-desc", sortKey: "PRICE", reverse: true },
	{ label: "Newest", value: "created-desc", sortKey: "CREATED_AT", reverse: true },
];

function parseSort(sort?: string) {
	return SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];
}

const getShopGrid = query(async (params: ShopGridParams) => {
	"use server";

	const sort = parseSort(params.sort);
	const collections = await getCollections();

	if (params.collection) {
		const { collection, products } = await getCollectionProducts({
			handle: params.collection,
			first: 12,
			after: params.after ?? null,
			sortKey: sort.sortKey,
			reverse: sort.reverse,
		});

		return { collections: collections.nodes, collection, products, sort: sort.value };
	}

	const products = await getProducts({
		first: 12,
		after: params.after ?? null,
		sortKey: sort.sortKey,
		reverse: sort.reverse,
	});

	return {
		collections: collections.nodes,
		collection: null,
		products,
		sort: sort.value,
	};
}, "shop-grid");

export const route = {
	preload: ({ location }: { location: { search: string } }) => {
		const params = Object.fromEntries(new URLSearchParams(location.search));
		return getShopGrid({
			collection: params.collection,
			sort: params.sort,
			after: params.after,
		});
	},
};

function gridParamsFromSearch(search: string): ShopGridParams {
	const params = Object.fromEntries(new URLSearchParams(search));
	return {
		collection: params.collection,
		sort: params.sort,
		after: params.after,
	};
}

export default function ShopPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	// Read URL from `useLocation` in the async source — not `useSearchParams`.
	// During route teardown, createAsync can refetch without a component owner;
	// reading search params there creates orphan computations (warns on leave).
	const data = createAsync(
		() => getShopGrid(gridParamsFromSearch(location.search)),
		{ deferStream: true },
	);

	const gridParams = () => gridParamsFromSearch(location.search);

	const buildHref = (next: Partial<ShopGridParams>) => {
		const params = new URLSearchParams();
		const merged = { ...gridParams(), ...next };
		if (merged.collection) params.set("collection", merged.collection);
		if (merged.sort) params.set("sort", merged.sort);
		if (merged.after) params.set("after", merged.after);
		const queryString = params.toString();
		return queryString ? `/_/shop?${queryString}` : "/_/shop";
	};

	return (
		<Show
			when={data()}
			fallback={
				<div class="min-h-[100vh] pt-24 pb-16">
					<Title>Shop | Mock Shop</Title>
					<Meta
						name="description"
						content="Browse products from the Mock Shop storefront demo."
					/>
					<div class="px-gx mx-auto max-w-7xl pt-8">
						<p class="text-neutral-600">Loading products…</p>
					</div>
				</div>
			}
		>
			{(grid) => (
				<div class="min-h-[100vh] pt-24 pb-16">
					<Title>
						{grid().collection?.title ?? "Shop"} | Mock Shop
					</Title>
					<Meta
						name="description"
						content={
							grid().collection?.description ??
							"Browse products from the Mock Shop storefront demo."
						}
					/>

					<div class="px-gx mx-auto flex max-w-7xl flex-col gap-8">
				<div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<h1 class="text-3xl font-semibold">
							{grid().collection?.title ?? "All products"}
						</h1>
						<p class="text-neutral-600">
							Powered by mock.shop — no token required.
						</p>
					</div>

					<label class="flex items-center gap-2 text-sm">
						<span>Sort</span>
						<select
							class="rounded border px-3 py-2"
							value={grid().sort ?? "best-selling"}
							onChange={(event) => {
								setSearchParams({
									sort: event.currentTarget.value,
									after: undefined,
								});
							}}
						>
							<For each={SORT_OPTIONS}>
								{(option) => <option value={option.value}>{option.label}</option>}
							</For>
						</select>
					</label>
				</div>

				<div class="flex flex-wrap gap-2">
					<A
						href={buildHref({ collection: undefined, after: undefined })}
						class="rounded-full border px-4 py-2 text-sm"
						classList={{ "bg-black text-white": !searchParams.collection }}
					>
						All
					</A>
					<For each={grid().collections}>
						{(collection) => (
							<A
								href={buildHref({
									collection: collection.handle,
									after: undefined,
								})}
								class="rounded-full border px-4 py-2 text-sm"
								classList={{
									"bg-black text-white":
										searchParams.collection === collection.handle,
								}}
							>
								{collection.title}
							</A>
						)}
					</For>
				</div>

				<Show
					when={grid().products.nodes.length}
					fallback={<p>No products found.</p>}
				>
					<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<For each={grid().products.nodes}>
							{(product, index) => (
								<ProductCardLink product={product} priority={index() === 0} />
							)}
						</For>
					</div>
				</Show>

				<Show when={grid().products.pageInfo.hasNextPage}>
					<div class="flex justify-center">
						<A
							href={buildHref({
								after: grid().products.pageInfo.endCursor ?? undefined,
							})}
							class="rounded border px-4 py-2"
						>
							Load more
						</A>
					</div>
				</Show>
					</div>
				</div>
			)}
		</Show>
	);
}
