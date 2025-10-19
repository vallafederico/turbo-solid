import { For, Show } from "solid-js";
import type { Thing } from "schema-dts";

// "schemas" prop can be typed as Thing[] for schema.org LD+JSON
export default function SchemaMarkup({
	schemas,
}: { schemas: Thing[] | undefined }) {
	return (
		<>
			<Show when={schemas && schemas.length > 0}>
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
