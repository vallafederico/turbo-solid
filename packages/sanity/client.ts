import { createClient } from "@sanity/client";
import { SANITY_CONFIG } from "@local/config";

const sanityClient = createClient({
	...SANITY_CONFIG,
	perspective: "drafts",
	useCdn: false,
	apiVersion: "2025-01-11",
	stega: {
		enabled: true, // only in preview
		studioUrl: "https://internetthings-starter.sanity.studio",
	},
	// Server-only: `process` is undefined in the browser, so no credential is
	// ever inlined into the client bundle. Reads that need the `drafts`
	// perspective must therefore run behind a `"use server"` boundary.
	token:
		typeof process !== "undefined" ? process.env.SANITY_API_TOKEN : undefined,
});

export default sanityClient;
