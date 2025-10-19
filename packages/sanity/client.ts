import { createClient } from "@sanity/client";
import { SANITY_CONFIG } from "@local/config";

const sanityClient = createClient({
	perspective: "drafts",
	useCdn: false,
	apiVersion: "2025-01-11",
	...SANITY_CONFIG,
	stega: {
		enabled: true, // only in preview
		studioUrl: "https://internetthings-starter.sanity.studio",
		// Optional: filter to skip specific fields (e.g., external URLs)
		// filter: (props) => props.filterDefault(props),
	},
	token:
		"skt5KY1LA2BbW1KNvuFZuSfIpJdertZhUTMGjnIBomnNFsxxl9NuIKXE090jUHcRH6ergamfx89RxXEUPN6T3samP8f4tLc7tntSGwgxejciCu2S8pTm2oSSKUWu3xKGPscCSAcc5sLqy5KZcJZpUXp6qUN5OcSTqAW20R1fXJlp47dyBIQM",
});

export default sanityClient;
