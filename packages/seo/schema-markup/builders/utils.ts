// schema/builders/utils.ts
import type { SanityImageAssetDocument } from "@sanity/client";
import type { SchemaImage, SchemaPerson, SchemaOrganization } from "../types";
import { createSchemaImageObject } from "../../utils/image";
import type { ImageObject } from "schema-dts";

/**
 * Normalize a name to create a valid @id
 */
export function normalizeId(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Helper to build Person schema or return reference if @id exists
 */
export function buildPersonSchema(
	person: SchemaPerson | undefined,
	asReference = false,
	baseUrl?: string,
): Record<string, unknown> | undefined {
	if (!person) return undefined;

	// Generate full URL for @id
	const base = baseUrl || "";
	const id = person["@id"]
		? person["@id"].startsWith("http")
			? person["@id"]
			: `${base}${person["@id"]}`
		: `${base}#person-${normalizeId(person.name)}`;

	// If requesting as reference, return just the reference
	if (asReference) {
		return { "@id": id };
	}

	return {
		"@type": "Person",
		"@id": id,
		name: person.name,
		url: person.url,
		sameAs: person.sameAs,
		jobTitle: person.jobTitle,
		image: createSchemaImageObject(person.image),
	};
}

/**
 * Helper to build Organization schema or return reference if @id exists
 */
export function buildOrgSchema(
	org: SchemaOrganization | undefined,
	asReference = false,
	baseUrl?: string,
): Record<string, unknown> | undefined {
	if (!org) return undefined;

	// Generate full URL for @id
	const base = baseUrl || org.url || "";
	const id = org["@id"]
		? org["@id"].startsWith("http")
			? org["@id"]
			: `${base}${org["@id"]}`
		: `${base}#organization-${normalizeId(org.name)}`;

	// If requesting as reference, return just the reference
	if (asReference) {
		return { "@id": id };
	}

	// Build department references (they'll be added as entities separately)
	const departments = org.department
		? org.department
				.map((dept) => buildOrgSchema(dept, true, baseUrl))
				.filter(Boolean)
		: undefined;

	// Build contact points
	const contactPoint = org.contactPoint
		? org.contactPoint.map((cp) => ({
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
		"@type": "Organization",
		"@id": id,
		name: org.name,
		url: org.url,
		logo: createSchemaImageObject(org.logo), // Logo should be provided or defaults applied upstream
		sameAs: org.sameAs,
		department: departments,
		contactPoint,
	};
}

/**
 * Helper to build Person or Organization schema
 * Detects type based on jobTitle presence (Person) or defaults to Organization
 */
export function buildPersonOrOrg(
	entity: SchemaPerson | SchemaOrganization,
	asReference = false,
	baseUrl?: string,
): Record<string, unknown> | undefined {
	if (!entity) return undefined;

	// Detect if it's a Person (has jobTitle) or Organization
	if ("jobTitle" in entity || !("logo" in entity)) {
		return buildPersonSchema(entity as SchemaPerson, asReference, baseUrl);
	}

	return buildOrgSchema(entity as SchemaOrganization, asReference, baseUrl);
}

/**
 * Helper to format date for schema.org
 */
export function formatSchemaDate(
	date?: string | Date | undefined,
): string | Date | undefined {
	if (!date) return undefined;

	if (typeof date === "string") {
		return date;
	}

	return date.toISOString();
}
