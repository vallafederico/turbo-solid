// schema/builders/webpage.ts
import type { WebPage, WithContext } from "schema-dts";

export function buildWebPageSchema({
	title,
	description,
	url,
	siteUrl,
	image,
	_createdAt: datePublished,
	_updatedAt: dateModified,
	author,
	...rest
}: {
	title: string;
	description: string;
	url: string;
	siteUrl: string;
	image?: string;
	_createdAt: string;
	_updatedAt: string;
	datePublished?: string;
	dateModified?: string;
	author?: string;
}): WithContext<WebPage> {
	const x = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: title,
		description,
		url: `${siteUrl}`,
		image,
		datePublished,
		dateModified,
		author: author ? { "@type": "Person", name: author } : undefined,
	};

	console.log(x);

	return x;
}
