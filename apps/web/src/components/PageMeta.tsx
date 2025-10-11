import { Link, Meta, MetaProvider, Title } from "@solidjs/meta";
import type { JSX } from "solid-js";

interface PageMetaProps {
	siteTitle?: string;
	title: string;
	description?: string;
	children?: JSX.Element;
}

export default function PageMeta({
	siteTitle = "AK Customs",
	title = "",
	description = "Michigan-made truck gear built tough for rigs that don’t quit — from rugged parts to custom merch, made for those who get it done without fuss.",
	children,
}: PageMetaProps) {
	const fullTitle = `${siteTitle}${title ? ` — ${title}` : ""}`;

	const locale = "en_US";
	const metaImagePath = "/images/og-image.jpg";

	const domain = import.meta.env.DEV
		? "http://localhost:3000"
		: "https://akcustomsllc.com";

	const metaImageUrl = `${domain}${metaImagePath}`;

	return (
		<MetaProvider>
			<Meta charset="utf-8" />
			<Meta name="viewport" content="width=device-width, initial-scale=1" />
			<Title>{fullTitle}</Title>

			<Meta name="theme-color" content="#010101" />
			<Meta name="description" content={description} />
			{/* Open Graph */}
			<Meta property="og:title" content={fullTitle} />
			<Meta property="og:description" content={description} />
			<Meta property="og:image" content={metaImageUrl} />
			<Meta property="og:image:alt" content={description} />
			<Meta property="og:site_name" content={siteTitle} />
			<Meta property="og:locale" content={locale} />
			<Meta property="og:url" content={domain} />
			<Meta property="og:type" content="website" />
			<Meta name="generator" content="Solid.js x Sanity.io x Shopify" />

			{/* Twitter */}
			<Meta property="twitter:card" content="summary_large_image" />
			<Meta property="twitter:title" content={fullTitle} />
			<Meta property="twitter:description" content={description} />
			<Meta property="twitter:image" content={metaImageUrl} />
			<Meta property="twitter:image:alt" content={description} />
			<Meta property="twitter:creator" content="@call_nye11" />

			<Link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
			<Link rel="icon" type="image/png" href="/favicons/favicon.png" />
			<Link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
			<Meta name="robots" content="/api/robots.txt" />
			{children}
		</MetaProvider>
	);
}
