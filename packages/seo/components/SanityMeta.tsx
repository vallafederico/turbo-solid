import { Link, Meta, Title } from "@solidjs/meta";
// import type { PageMetadata, SeoDefaults } from "@crawl-me-maybe/web";
import { buildSeoPayload } from "@crawl-me-maybe/web";
import { getDocumentByType } from "@local/sanity";
import { createAsync, query } from "@solidjs/router";
import { For, Show } from "solid-js";
import SchemaMarkup from "./SchemaMarkup";
import { SANITY_CONFIG } from "../../config";

// Kept behind `"use server"` so the Sanity client — and the API token it is
// configured with — stays out of the browser bundle.
const getSeoDefaults = query(async () => {
	"use server";
	return getDocumentByType("seoDefaults");
}, "seo-defaults");

const getSchemaDefaults = query(async () => {
	"use server";
	return getDocumentByType("schemaMarkupDefaults");
}, "seo-schema-defaults");

type SanityMetaProps = {
	pageData?: any;
	seoDefaults?: any;
	schemaDefaults?: any;
	isHomepage?: boolean;
};

export default function SanityMeta({
	pageData,
	isHomepage = false,
}: SanityMetaProps) {
	const seoDefaults = createAsync(() => getSeoDefaults(), {
		deferStream: true,
	});

	const schemaDefaults = createAsync(() => getSchemaDefaults(), {
		deferStream: true,
	});

	return (
		<Show when={seoDefaults()}>
			{(defaults) => {
				// Empty object when no CMS page: mergeSeoData warns on falsy `page` even though
				// defaults-only mode is valid (e.g. static routes using global SEO).
				const { meta, schemas } = buildSeoPayload({
					globalDefaults: defaults(),
					seoFieldName: "seo",
					schemaDefaults: schemaDefaults(),
					pageSeo: pageData ?? {},
					pageSchemaType: pageData?.schemaMarkup?.type,
					extraSchemaData: {
						_createdAt: pageData?._createdAt,
						_updatedAt: pageData?._updatedAt,
					},
					isHomepage,
					projectId: SANITY_CONFIG.projectId,
					dataset: SANITY_CONFIG.dataset,
				});

				return (
					<>
						<Title>{meta.title ?? ""}</Title>

						<For each={meta.favicons}>
							{(favicon) => (
								<Link
									rel="icon"
									href={favicon.href}
									type={favicon.type}
									sizes={favicon.sizes}
								/>
							)}
						</For>

						<Meta name="description" content={meta.description ?? ""} />
						{meta.robots && <Meta name="robots" content={meta.robots} />}

						{/* Open Graph */}
						<Meta property="og:title" content={meta.title ?? ""} />
						<Meta property="og:description" content={meta.description ?? ""} />
						<Meta property="og:url" content={meta.canonicalUrl ?? ""} />

						{/* Twitter */}
						<Meta property="twitter:card" content="summary_large_image" />
						<Meta property="twitter:title" content={meta.title ?? ""} />
						<Meta
							property="twitter:description"
							content={meta.description ?? ""}
						/>

						{/* Schema Markup */}
						<Show when={schemas && schemaDefaults()}>
							<SchemaMarkup schemas={schemas} />
						</Show>
					</>
				);
			}}
		</Show>
	);
}
