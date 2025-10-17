import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: {
		projectId: "6mav93fo",
		dataset: "production",
	},
	studioHost: "internetthings-starter",
	/**
	 * Enable auto-updates for studios.
	 * Learn more at https://www.sanity.io/docs/cli#auto-updates
	 */
	autoUpdates: false,
});
