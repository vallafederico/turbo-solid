import { Money, ShopifyImage } from "@local/shopify/solid";
import { A } from "@solidjs/router";
import type { ProductCard } from "@local/shopify";

export type ProductCardLinkProps = {
	product: ProductCard;
	priority?: boolean;
};

export default function ProductCardLink(props: ProductCardLinkProps) {
	return (
		<A
			href={`/_/shop/${props.product.handle}`}
			class="group flex flex-col gap-3"
		>
			<ShopifyImage
				image={props.product.featuredImage}
				alt={props.product.title}
				width={640}
				priority={props.priority}
				class="aspect-square w-full object-cover"
			/>
			<div>
				<h3 class="font-medium group-hover:underline">{props.product.title}</h3>
				<Money data={props.product.priceRange.minVariantPrice} />
			</div>
		</A>
	);
}
