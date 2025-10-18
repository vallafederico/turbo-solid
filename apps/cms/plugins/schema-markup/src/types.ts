export type SchemaMarkupType =
	| "WebSite"
	| "WebPage"
	| "Article"
	| "Product"
	| "Event"
	| "FAQPage"
	| "BreadcrumbList"
	| "Organization"
	| "Person"
	| "LocalBusiness";

export type PreviewCardProps = {
	siteUrl: string;
	title: string;
	description: string;
	image: string;
	twitterHandle?: string;
	favicon?: string;
};
