import { Meta, Title } from "@solidjs/meta";
import type { PageMetadata, SeoDefaults } from "../utils/merge";
import { buildSeoPayload } from "../build";
import { getDocumentByType } from "@local/sanity";
import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
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
					const { meta, schema } = buildSeoPayload({
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
							<Show when={schema && schemaDefaults()}>
								<SchemaMarkup
									seo={meta}
									schemaDefaults={schemaDefaults()}
									type={
										typeof pageData?.schemaMarkup === "string"
											? pageData.schemaMarkup
											: (pageData?.schemaMarkup as unknown as { type?: string })
													?.type
									}
									extra={{
										_createdAt: pageData?._createdAt,
										_updatedAt: pageData?._updatedAt,
									}}
								/>
							</Show>
						</>
					);
				}}
			</Show>
		</>
	);
}
