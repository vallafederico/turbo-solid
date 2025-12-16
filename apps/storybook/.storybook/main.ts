import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineMain } from "storybook-solidjs-vite";

export default defineMain({
	stories: ["../../../packages/ui/**/*.stories.tsx"],
	staticDirs: ["../../web/public"],

	framework: {
		name: getAbsolutePath("storybook-solidjs-vite"),
		options: {
			// docgen: {
			// Enabled by default, but you can configure or disable it:
			//  see https://github.com/styleguidist/react-docgen-typescript#options
			// },
		},
	},
});

function getAbsolutePath(value: string): any {
	return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
