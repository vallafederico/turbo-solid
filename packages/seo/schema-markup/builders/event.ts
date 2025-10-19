// schema/builders/event.ts
import { createSchemaImageObject } from "../../utils";
import type { MergedMetadata } from "../../utils/merge";
import type { SchemaDefaults } from "../compose";
import { coalesce } from "../schema-utils";
import type { SchemaImage, SchemaPerson, SchemaOrganization } from "../types";
import { buildPersonOrOrg, formatSchemaDate } from "./utils";

export function buildEvent({
	seo,
	schemaDefaults,
	extra,
}: {
	seo: MergedMetadata;
	schemaDefaults?: SchemaDefaults;
	extra?: Record<string, unknown>;
}): Record<string, unknown> {
	const defaults = schemaDefaults?.event || {};
	const autoMap = schemaDefaults?.autoMap || {};

	// Use auto-mapping if enabled
	const name =
		autoMap.title !== false ? seo.title : (extra?.name as string | undefined);
	const description =
		autoMap.description !== false
			? seo.description
			: (extra?.description as string | undefined);
	const image = createSchemaImageObject(
		autoMap.image !== false ? seo.metaImage : (extra?.image as SchemaImage),
		schemaDefaults?.imageFallback,
	);

	// Build location
	const location = extra?.location
		? {
				"@type": extra.location.url ? "VirtualLocation" : "Place",
				name: extra.location.name,
				url: extra.location.url,
				address: extra.location.address,
				geo: extra.location.geo
					? {
							"@type": "GeoCoordinates",
							latitude: extra.location.geo.latitude,
							longitude: extra.location.geo.longitude,
						}
					: undefined,
			}
		: undefined;

	// Build organizer (use references since they're added as entities first)
	const organizer = coalesce(
		extra?.organizer,
		defaults.organizer,
		schemaDefaults?.organization,
	) as SchemaOrganization | SchemaPerson | undefined;

	const organizerSchema = Array.isArray(organizer)
		? (organizer as Array<SchemaPerson | SchemaOrganization>)
				.map((org) => buildPersonOrOrg(org, true, seo.canonicalUrl))
				.filter(Boolean)
		: buildPersonOrOrg(
				organizer as SchemaPerson | SchemaOrganization,
				true,
				seo.canonicalUrl,
			);

	// Build performer (use references since they're added as entities first)
	const performer = extra?.performer
		? (extra.performer as Array<SchemaPerson | SchemaOrganization>)
				.map((perf) => buildPersonOrOrg(perf, true, seo.canonicalUrl))
				.filter(Boolean)
		: undefined;

	return {
		"@context": "https://schema.org",
		"@type": "Event",
		name: coalesce(name, extra?.name),
		description: coalesce(description, extra?.description),
		image,
		startDate: formatSchemaDate(extra?.startDate),
		endDate: formatSchemaDate(extra?.endDate),
		eventStatus: extra?.eventStatus
			? `https://schema.org/${extra.eventStatus}`
			: undefined,
		eventAttendanceMode: coalesce(
			extra?.eventAttendanceMode,
			defaults.eventAttendanceMode,
		)
			? `https://schema.org/${extra.eventAttendanceMode || defaults.eventAttendanceMode}`
			: undefined,
		location,
		organizer: organizerSchema,
		performer,
		offers: extra?.offers,
		url: seo.canonicalUrl,
	};
}
