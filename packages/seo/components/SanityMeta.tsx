import { Link, Meta, Title } from "@solidjs/meta";
import type { PageMetadata, SeoDefaults } from "../utils/merge";
import { buildSeoPayload } from "../build";
import { getDocumentByType } from "@local/sanity";
import { createAsync } from "@solidjs/router";
import { For, Show } from "solid-js";
import SchemaMarkup from "../schema-markup/SchemaMarkup";
import type { SchemaDefaults } from "../schema-markup";

type SanityMetaProps = {
	pageData?: PageMetadata;
	seoDefaults?: SeoDefaults;
	schemaDefaults?: SchemaDefaults;
	isHomepage?: boolean;
};

export default function SanityMeta({
	pageData,
	isHomepage = false,
}: SanityMetaProps) {
	const seoDefaults = createAsync(() => getDocumentByType("seoDefaults"), {
		deferStream: true,
	});

	const schemaDefaults = createAsync(
		() => getDocumentByType("schemaMarkupDefaults"),
		{
			deferStream: true,
		},
	);

	return (
		<>
			<Show when={seoDefaults()}>
				{(defaults) => {
					const { meta, schemas } = buildSeoPayload({
						globalDefaults: defaults(),
						schemaDefaults: schemaDefaults(),
						pageSeo: pageData,
						pageSchemaType: pageData?.schemaMarkup,
						extraSchemaData: {
							_createdAt: pageData?._createdAt,
							_updatedAt: pageData?._updatedAt,
						},
						isHomepage,
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
							<Meta
								property="og:description"
								content={meta.description ?? ""}
							/>
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
		</>
	);
}
