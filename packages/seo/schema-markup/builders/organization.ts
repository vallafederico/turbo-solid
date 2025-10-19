// schema/builders/organization.ts
import { createSchemaImageObject } from "../../utils";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaOrganization } from "../types";
import { normalizeId, buildOrgSchema } from "./utils";

export function buildOrganization(
	organization: SchemaOrganization,
	schemaDefaults?: SchemaDefaults,
	baseUrl?: string,
	asReference = false,
): Record<string, unknown> {
	// Generate full URL for @id
	const base = baseUrl || organization.url || "";
	const id = organization["@id"]
		? organization["@id"].startsWith("http")
			? organization["@id"]
			: `${base}${organization["@id"]}`
		: `${base}#organization-${normalizeId(organization.name)}`;

	// If requesting as reference, return just the reference
	if (asReference) {
		return { "@id": id };
	}

	// Build department references (they'll be added as entities separately)
	const departments = organization.department
		? organization.department
				.map((dept) => buildOrgSchema(dept, true, baseUrl))
				.filter(Boolean)
		: undefined;

	// Build contact points
	const contactPoint = organization.contactPoint
		? organization.contactPoint.map((cp) => ({
				"@type": "ContactPoint",
				contactType: cp.contactType,
				telephone: cp.telephone,
				email: cp.email,
				url: cp.url,
				areaServed: cp.areaServed,
				availableLanguage: cp.availableLanguage,
			}))
		: undefined;

	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": id,
		name: organization.name,
		url: organization.url,
		logo: createSchemaImageObject(
			organization.logo,
			coalesce(schemaDefaults?.logo, schemaDefaults?.imageFallback),
		),
		sameAs: coalesce(organization.sameAs, schemaDefaults?.sameAs),
		department: departments,
		contactPoint,
	};
}
