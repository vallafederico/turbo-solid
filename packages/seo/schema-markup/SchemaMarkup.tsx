import { For, Show } from "solid-js";
// If you're using schema-ltd, you can import the type like this:
import type { Thing } from "schema-dts";
import { composeSchema, type SchemaDefaults } from "./compose";
import type { MergedMetadata } from "../utils/merge";

// "schemas" prop can be typed as Thing[] for schema.org LD+JSON
export default function SchemaMarkup({ schemas }: { schemas: Thing[] }) {
	return (
		<>
			<Show when={schemas?.length > 0}>
				<For each={schemas}>
					{(schema) => (
						<script
							type="application/ld+json"
							innerHTML={JSON.stringify(schema)}
						/>
					)}
				</For>
			</Show>
		</>
	);
}

// If you need to support any structure that schema-ltd allows, "Thing" covers the root for most structured data types.
