import { schemaMarkupAddress } from "./schema-markup/address";
import { schemaMarkupAggregateRating } from "./schema-markup/aggregate-rating";
import { schemaMarkupGeo } from "./schema-markup/geo";
import metaDescription from "./metadata/meta-description";
import metadata from "./metadata/page-metadata";
import { schemaMarkup } from "./schema-markup/schemaMarkup";
import indexing from "./metadata/indexing";
import favicon from "./metadata/favicon";

export default [
	indexing,
	favicon,
	schemaMarkupAddress,
	schemaMarkupGeo,
	schemaMarkupAggregateRating,
	schemaMarkup,
	metadata,
	metaDescription,
];
