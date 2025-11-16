import { createClient } from "@sanity/client";
import { SANITY_CONFIG } from "./config";

const sanityClient = createClient({
	...SANITY_CONFIG,
	perspective: "drafts",
	useCdn: false,
	apiVersion: "2025-01-11",
	stega: {
		enabled: true, // only in preview
		studioUrl: "https://internetthings-starter.sanity.studio",
	},
	token: process.env.SANITY_API_TOKEN,
});

export default sanityClient;
