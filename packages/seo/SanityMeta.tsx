import { Link, Meta, Title } from "@solidjs/meta";
import type { MergedMetadata, PageMetadata } from "./utils";
import SchemaMarkup from "./schema-markup/SchemaMarkup";
import { getDocumentByType } from "node_modules/@local/sanity";
import { createAsync } from "@solidjs/router";

interface SanityMetatagsProps {
	siteTitle?: string;
	title: string;
	description?: string;
}

export default function SanityMeta({
	seo,
}: {
	seo: PageMetadata;
	schemaMarkup?: string;
}) {
	const seoDefaults = createAsync(() => getDocumentByType("seoDefaults"));

	return (
		<>
			<Title>{title}</Title>
			<Meta name="description" content={description} />
			{/* Open Graph */}
			<Meta property="og:title" content={title} />
			<Meta property="og:description" content={description} />
			{/* <Meta property="og:image" content={image} /> */}
			{/* Twitter */}
			<Meta property="twitter:card" content="summary_large_image" />
			<Meta property="twitter:title" content={title} />
			<Meta property="twitter:description" content={description} />

			<Link rel="icon" href="/favicon.ico" />
			{schemaMarkup && <SchemaMarkup schemaMarkup={schemaMarkup} />}

			{/* <Meta property="twitter:image" content={image} /> */}
		</>
	);
}
