import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineMain } from "storybook-solidjs-vite";

export default defineMain({
	stories: ["../../../packages/ui/**/*.stories.tsx"],
	staticDirs: ["../../web/public"],

	framework: {
		name: getAbsolutePath("storybook-solidjs-vite"),
		options: {},
	},
});

function getAbsolutePath(value: string): any {
	return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
