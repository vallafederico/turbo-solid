import type { SanityImageAssetDocument } from "@sanity/client";

export type SchemaImage = SanityImageAssetDocument;

export type SchemaAddress = {
	streetAddress?: string;
	addressLocality?: string;
	addressRegion?: string;
	postalCode?: string;
	addressCountry?: string;
};

export type SchemaGeo = {
	latitude?: number | string;
	longitude?: number | string;
};

export type SchemaAggregateRating = {
	ratingValue?: number | string;
	reviewCount?: number | string;
	bestRating?: number | string;
	worstRating?: number | string;
};

export type SchemaPerson = {
	"@id"?: string; // Unique identifier for referencing
	name: string;
	url?: string;
	sameAs?: string[];
	jobTitle?: string;
	image?: SchemaImage;
	affiliation?: SchemaOrganization[];
};

export type SchemaContactPoint = {
	contactType: string; // e.g., "customer service", "sales", "support"
	telephone?: string;
	email?: string;
	url?: string;
	areaServed?: string[];
	availableLanguage?: string[];
};

export type SchemaOrganization = {
	"@id"?: string; // Unique identifier for referencing
	name: string;
	url?: string;
	logo?: SchemaImage;
	sameAs?: string[];
	department?: SchemaOrganization[]; // Sub-organizations or departments
	contactPoint?: SchemaContactPoint[]; // Contact information
};

export type SchemaFAQItem = {
	question: string;
	answer: string;
};

export type SchemaSearchAction = {
	target?: string;
	queryInput?: string;
};

export type SchemaLocation = {
	name?: string;
	url?: string;
	address?: SchemaAddress;
	geo?: SchemaGeo;
};

export type SchemaOffer = {
	"@type": "Offer";
	price?: number | string;
	priceCurrency?: string;
	availability?: string;
	url?: string;
};
