import path from "node:path";
import { defineMain } from "storybook-solidjs-vite";

export default defineMain({
	stories: ["../../../packages/ui/**/*.stories.tsx"],
	staticDirs: ["../../web/public"],
	async viteFinal(config) {
		config.resolve.alias = [
			{
				find: "@local",
				replacement: path.resolve(__dirname, "../../../packages"),
			},
		];

		return config;
	},
	framework: {
		name: "storybook-solidjs-vite",
		options: {
			// docgen: {
			// Enabled by default, but you can configure or disable it:
			//  see https://github.com/styleguidist/react-docgen-typescript#options
			// },
		},
	},
	addons: [
		"@storybook/addon-onboarding",
		"@storybook/addon-docs",
		"@storybook/addon-a11y",
		"@storybook/addon-links",
		"@storybook/addon-vitest",
	],
});
