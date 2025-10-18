import { Link, Meta, Title } from "@solidjs/meta";
import type { MergedMetadata } from "../utils";

export default function SanityMetaTags({
	title,
	description,
	canonicalUrl,
	metaImage,
	favicon,
	twitterHandle,
	robots,
	schemaMarkup,
}: MergedMetadata) {
	return (
		<>
			<Title>{title}</Title>
			<Meta name="description" content={description} />
			<Meta property="og:title" content={title} />
			<Meta property="og:description" content={description} />
			<Meta property="twitter:card" content="summary_large_image" />
			<Meta property="twitter:title" content={title} />
			<Meta property="twitter:description" content={description} />
			{canonicalUrl && <Link rel="canonical" href={canonicalUrl} />}
			{robots && <Meta name="robots" content={robots} />}
		</>
	);
}
