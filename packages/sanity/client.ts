import { createClient } from "@sanity/client";
import { SANITY } from "../../config";

const sanityClient = createClient({
	perspective: "drafts",
	useCdn: false,
	apiVersion: "2025-01-11",
	...SANITY,
	stega: {
		enabled: true, // only in preview
		studioUrl: import.meta.env.VITE_STUDIO_URL || "/studio",
		// Optional: filter to skip specific fields (e.g., external URLs)
		// filter: (props) => props.filterDefault(props),
	},
	token:
		"skt5KY1LA2BbW1KNvuFZuSfIpJdertZhUTMGjnIBomnNFsxxl9NuIKXE090jUHcRH6ergamfx89RxXEUPN6T3samP8f4tLc7tntSGwgxejciCu2S8pTm2oSSKUWu3xKGPscCSAcc5sLqy5KZcJZpUXp6qUN5OcSTqAW20R1fXJlp47dyBIQM",
});

export default sanityClient;
