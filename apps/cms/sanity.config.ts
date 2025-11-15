import { crawlMeMaybe } from "@crawl-me-maybe/sanity";
import { DOMAIN, SANITY_CONFIG } from "@local/config";
import { userGuidePlugin } from "@q42/sanity-plugin-user-guide";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { noteField } from "sanity-plugin-note-field";
import Logo from "./components/Logo";
import { structure } from "./desk/structure";
import { userGuideStructure } from "./guides/userGuideStructure";
import { schemaTypes } from "./schemas";

const sharedConfig = [
	structureTool({
		name: "studio",
		title: "Studio",
		structure,
	}),
	media(),
	noteField(),
	userGuidePlugin({ userGuideStructure }),
	crawlMeMaybe(),
	// presentationTool({
	// 	previewUrl: {
	// 		initial: DOMAIN,
	// 		origin: DOMAIN,
	// 		previewMode: {
	// 			enable: "/api/preview-enable",
	// 			disable: "/api/preview-disable",
	// 		},
	// 	},
	// 	allowOrigins: ["http://localhost:*", DOMAIN],
	// 	resolve,
	// }),
];

const devConfig = [visionTool()];

export default defineConfig({
	...SANITY_CONFIG,
	scheduledPublishing: { enabled: false }, // enable if client pays for this feature
	icon: Logo,

	plugins: [...sharedConfig, ...devConfig],
	schema: {
		types: schemaTypes,
	},
});
