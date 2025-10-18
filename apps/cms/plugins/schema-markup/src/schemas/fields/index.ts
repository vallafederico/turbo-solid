import { schemaMarkupAddress } from "./address";
import { schemaMarkupAggregateRating } from "./aggregate-rating";
import { schemaMarkupGeo } from "./geo";
import metadata from "./metadata";
import { schemaMarkup } from "./schemaMarkup";

export default [
	schemaMarkupAddress,
	schemaMarkupGeo,
	schemaMarkupAggregateRating,
	schemaMarkup,
	metadata,
];
