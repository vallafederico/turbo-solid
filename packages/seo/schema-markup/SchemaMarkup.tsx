import { For } from "solid-js";
import { composeSchema, type SchemaDefaults } from "./compose";
import type { MergedMetadata } from "../utils/merge";

export type SchemaMarkupProps = {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	type?: string;
	extra?: Record<string, unknown>;
};

export default function SchemaMarkup({
	seo,
	schemaDefaults,
	type,
	extra,
}: SchemaMarkupProps) {
	const schemas = composeSchema({
		seo,
		schemaDefaults,
		type,
		extra,
	});

	if (!schemas || schemas.length === 0) {
		return null;
	}

	return (
		<>
			<For each={schemas}>
				{(schema) => (
					<script
						type="application/ld+json"
						innerHTML={JSON.stringify(schema)}
					/>
				)}
			</For>
		</>
	);
}
