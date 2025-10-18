// schema/builders/website.ts
import type { SchemaOrganization, SchemaSearchAction } from "../types";
import { buildOrgSchema } from "./utils";

export function buildWebSite({
	name,
	url,
	publisher,
	searchAction,
	inLanguage,
}: {
	name?: string;
	url?: string;
	publisher?: SchemaOrganization;
	searchAction?: SchemaSearchAction;
	inLanguage?: string;
}): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": url ? `${url}#website` : undefined,
		name,
		url,
		publisher: buildOrgSchema(publisher, true, url), // Use reference since it's added as entity first
		inLanguage,
		potentialAction: searchAction?.target
			? {
					"@type": "SearchAction",
					target: {
						"@type": "EntryPoint",
						urlTemplate: searchAction.target,
					},
					"query-input":
						searchAction.queryInput || "required name=search_term_string",
				}
			: undefined,
	};
}
