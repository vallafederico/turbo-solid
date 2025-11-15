import { SANITY_CONFIG } from "@local/config";
import { createClient } from "@sanity/client";

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
