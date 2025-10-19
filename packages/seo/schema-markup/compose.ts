// schema/compose.ts
import {
	buildWebPage,
	buildArticle,
	buildProduct,
	buildEvent,
	buildFAQPage,
	buildWebSite,
	buildOrganization,
	buildPersonOrOrg,
	buildAboutPage,
	buildContactPage,
} from "./builders";
import type { MergedMetadata } from "../utils/merge";
import type {
	SchemaImage,
	SchemaOrganization,
	SchemaPerson,
	SchemaSearchAction,
	SchemaAddress,
	SchemaGeo,
	SchemaAggregateRating,
} from "./types";
import type { Thing } from "schema-dts";

export type SchemaDefaults = {
	sameAs?: string[];
	logo?: SchemaImage; // Global logo fallback
	organization?: SchemaOrganization;
	publisher?: SchemaOrganization;
	imageFallback?: SchemaImage;
	imageFieldMapping?: string[];
	autoMap?: {
		title?: boolean;
		description?: boolean;
		image?: boolean;
		dates?: boolean;
		authors?: boolean;
	};
	webSite?: {
		name?: string;
		publisher?: SchemaOrganization;
		searchAction?: SchemaSearchAction;
	};
	webPage?: {
		inLanguage?: string;
		primaryImageOfPage?: SchemaImage;
	};
	article?: {
		publisher?: SchemaOrganization;
		section?: string;
	};
	product?: {
		brand?: SchemaOrganization;
		priceCurrency?: string;
		availability?: string;
	};
	event?: {
		eventAttendanceMode?: string;
		organizer?: SchemaOrganization | SchemaPerson;
	};
	localBusiness?: {
		priceRange?: string;
		address?: SchemaAddress;
		geo?: SchemaGeo;
		aggregateRating?: SchemaAggregateRating;
	};
	rendering?: {
		multiLocaleStrategy?: string;
	};
};

/**
 * Composes the complete schema markup for a page
 * Returns an array of schema objects to be rendered as JSON-LD
 *
 * Entities with @id (Person, Organization) are output as full schemas first,
 * then referenced by @id in other schemas for cleaner markup.
 */

interface ComposeSchemaProps {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	type?: string;
	extra?: Record<string, unknown>;
	isHomepage?: boolean;
}

export function composeSchema({
	seo,
	schemaDefaults,
	type = "WebPage",
	extra,
	isHomepage = false,
}: ComposeSchemaProps): Thing[] {
	const schemas: unknown[] = [];
	const entities = new Set<string>(); // Track entities we've already added

	// Extract base URL from seo data
	const baseUrl = seo.canonicalUrl || "";

	// Helper to add entity schemas (Person, Organization) with @id
	const addEntity = (entity: unknown, buildFn: (e: unknown) => unknown) => {
		if (!entity) return;
		const schema = buildFn(entity) as Record<string, unknown>;
		if (schema?.["@id"] && !entities.has(schema["@id"] as string)) {
			entities.add(schema["@id"] as string);
			schemas.push(schema);
		}
	};

	// Helper to recursively add organization and all its departments
	const addOrgWithDepartments = (org: SchemaOrganization) => {
		// Apply global logo fallback if organization doesn't have a logo
		const orgWithDefaults = {
			...org,
			logo: org.logo || schemaDefaults?.logo,
		};

		// Add the organization itself
		addEntity(orgWithDefaults, (o) =>
			buildOrganization(o as SchemaOrganization, schemaDefaults, baseUrl),
		);

		// Recursively add all departments
		if (org.department && Array.isArray(org.department)) {
			for (const dept of org.department) {
				addOrgWithDepartments(dept);
			}
		}
	};

	// Add Organization entities first (can be referenced by others)
	if (schemaDefaults?.organization) {
		addOrgWithDepartments(schemaDefaults.organization);
	}

	if (
		schemaDefaults?.publisher &&
		schemaDefaults.publisher !== schemaDefaults.organization
	) {
		addOrgWithDepartments(schemaDefaults.publisher);
	}

	// Add Person entities from extra data (e.g., authors, contributors)
	if (extra?.author && Array.isArray(extra.author)) {
		for (const author of extra.author) {
			if (author && typeof author === "object" && "name" in author) {
				addEntity(author, (person) =>
					buildPersonOrOrg(
						person as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	if (extra?.contributor && Array.isArray(extra.contributor)) {
		for (const contributor of extra.contributor) {
			if (
				contributor &&
				typeof contributor === "object" &&
				"name" in contributor
			) {
				addEntity(contributor, (person) =>
					buildPersonOrOrg(
						person as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	if (extra?.organizer && Array.isArray(extra.organizer)) {
		for (const organizer of extra.organizer) {
			if (organizer && typeof organizer === "object" && "name" in organizer) {
				// Apply logo fallback for organizations
				const entityWithDefaults =
					"jobTitle" in organizer
						? organizer
						: { ...organizer, logo: organizer.logo || schemaDefaults?.logo };
				addEntity(entityWithDefaults, (entity) =>
					buildPersonOrOrg(
						entity as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	if (extra?.performer && Array.isArray(extra.performer)) {
		for (const performer of extra.performer) {
			if (performer && typeof performer === "object" && "name" in performer) {
				// Apply logo fallback for organizations
				const entityWithDefaults =
					"jobTitle" in performer
						? performer
						: { ...performer, logo: performer.logo || schemaDefaults?.logo };
				addEntity(entityWithDefaults, (entity) =>
					buildPersonOrOrg(
						entity as SchemaPerson | SchemaOrganization,
						false,
						baseUrl,
					),
				);
			}
		}
	}

	// Add brand from product schema (including its departments)
	if (
		extra?.brand &&
		typeof extra.brand === "object" &&
		"name" in extra.brand
	) {
		addOrgWithDepartments(extra.brand as SchemaOrganization);
	}

	// Always include WebSite if defaults provided, or automatically generate for homepage
	if (schemaDefaults?.webSite || isHomepage) {
		schemas.push(
			buildWebSite({
				...(schemaDefaults?.webSite || {}),
				name: schemaDefaults?.webSite?.name || seo.title,
				url: seo.canonicalUrl,
				publisher:
					schemaDefaults?.webSite?.publisher ||
					schemaDefaults?.publisher ||
					schemaDefaults?.organization,
				searchAction: schemaDefaults?.webSite?.searchAction,
			}),
		);
	}

	const builders = {
		Article: buildArticle,
		Product: buildProduct,
		Event: buildEvent,
		FAQPage: buildFAQPage,
		WebPage: buildWebPage,
		AboutPage: buildAboutPage,
		ContactPage: buildContactPage,
	};

	if (builders[type as keyof typeof builders]) {
		schemas.push(
			builders[type as keyof typeof builders]({
				seo,
				schemaDefaults,
				extra,
			}),
		);
	}

	return schemas.filter(Boolean);
}
