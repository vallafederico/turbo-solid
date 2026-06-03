import {
	getProduct,
	getProductOptions,
	getSelectedProductOptions,
} from "@local/shopify";
import { Money, ShopifyImage } from "@local/shopify/solid";
import { SchemaMarkup } from "@local/seo";
import { Meta, Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import {
	createAsync,
	query,
	useLocation,
	type RouteSectionProps,
} from "@solidjs/router";
import { Show } from "solid-js";
import AddToCartButton from "~/components/shop/AddToCartButton";
import VariantSelector from "~/components/shop/VariantSelector";

const getProductPage = query(
	async (handle: string, search: Record<string, string>) => {
		"use server";

		const selectedOptions = getSelectedProductOptions(search);
		const product = await getProduct(handle, selectedOptions);

		if (!product) return null;

		const productOptions = getProductOptions(product);
		const selectedVariant = product.selectedOrFirstAvailableVariant ?? undefined;

		return {
			product,
			productOptions,
			selectedVariant,
			isValidSelection: Boolean(selectedVariant?.availableForSale),
		};
	},
	"product-page",
);

export const route = {
	preload: ({
		params,
		location,
	}: {
		params: { handle: string };
		location: { search: string };
	}) => {
		const search = Object.fromEntries(new URLSearchParams(location.search));
		return getProductPage(params.handle, search);
	},
};

export default function ProductPage(props: RouteSectionProps) {
	const location = useLocation();

	const searchParams = () =>
		Object.fromEntries(new URLSearchParams(location.search));

	const data = createAsync(
		() => getProductPage(props.params.handle, searchParams()),
		{ deferStream: true },
	);

	const displayImage = () =>
		data()?.selectedVariant?.image ??
		data()?.product.images?.[0] ??
		data()?.product.featuredImage;

	const displayPrice = () =>
		data()?.selectedVariant?.price ??
		data()?.product.priceRange.minVariantPrice;

	const compareAtPrice = () => {
		const variant = data()?.selectedVariant;
		const compareAt = variant?.compareAtPrice;
		if (!compareAt || !variant) return undefined;
		if (Number(compareAt.amount) <= Number(variant.price.amount)) {
			return undefined;
		}
		return compareAt;
	};

	const productSchema = () => {
		const page = data();
		if (!page) return [];

		return [
			{
				"@context": "https://schema.org",
				"@type": "Product",
				name: page.product.title,
				description: page.product.description,
				image: page.product.images?.map((image) => image.url) ?? [],
				sku: page.selectedVariant?.sku ?? page.selectedVariant?.id,
				brand: page.product.vendor
					? { "@type": "Brand", name: page.product.vendor }
					: undefined,
				offers: page.selectedVariant
					? {
							"@type": "Offer",
							price: page.selectedVariant.price.amount,
							priceCurrency: page.selectedVariant.price.currencyCode,
							availability: page.selectedVariant.availableForSale
								? "https://schema.org/InStock"
								: "https://schema.org/OutOfStock",
						}
					: undefined,
			},
		];
	};

	return (
		<Show
			when={data()}
			fallback={
				<div class="min-h-[100vh] pt-24">
					<HttpStatusCode code={404} />
					<Title>Product not found</Title>
					<div class="px-gx">
						<h1 class="text-2xl font-semibold">Product not found</h1>
					</div>
				</div>
			}
		>
			{(page) => (
				<div class="min-h-[100vh] pt-24 pb-16">
					<Title>
						{page().product.seo?.title ?? page().product.title} | Mock Shop
					</Title>
					<Meta
						name="description"
						content={
							page().product.seo?.description ??
							page().product.description ??
							page().product.title
						}
					/>
					<SchemaMarkup schemas={productSchema()} />

					<div class="px-gx mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
						<ShopifyImage
							image={displayImage()}
							alt={page().product.title}
							width={1200}
							priority
							class="aspect-square w-full object-cover"
						/>

						<div class="flex flex-col gap-6">
							<div>
								<p class="text-sm uppercase tracking-wide text-neutral-500">
									{page().product.vendor}
								</p>
								<h1 class="text-3xl font-semibold">{page().product.title}</h1>
								<div class="mt-2 flex items-baseline gap-3 text-xl">
									<Money data={displayPrice()} />
									<Show when={compareAtPrice()}>
										<Money
											data={compareAtPrice()}
											class="text-base text-neutral-500 line-through"
										/>
									</Show>
								</div>
							</div>

							<VariantSelector
								productOptions={page().productOptions}
								selectedVariant={page().selectedVariant}
							/>

							{(() => {
								const variant = page().selectedVariant;
								return (
									<AddToCartButton
										merchandiseId={variant?.id ?? ""}
										disabled={
											!variant ||
											!page().isValidSelection ||
											!variant.availableForSale
										}
										variant={
											variant
												? {
														id: variant.id,
														title: variant.title,
														price: variant.price,
														image: variant.image,
														product: {
															title: page().product.title,
															handle: page().product.handle,
														},
													}
												: undefined
										}
									/>
								);
							})()}

							<div
								class="prose max-w-none"
								innerHTML={page().product.descriptionHtml ?? ""}
							/>

							<Show when={page().product.tags?.length}>
								<div class="flex flex-wrap gap-2">
									{page().product.tags?.map((tag) => (
										<span class="rounded-full bg-neutral-100 px-3 py-1 text-sm">
											{tag}
										</span>
									))}
								</div>
							</Show>
						</div>
					</div>
				</div>
			)}
		</Show>
	);
}
