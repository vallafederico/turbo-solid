import { kebabCase, sentenceCase } from "text-case";
import { handleField } from "./field-handlers";

import { CONFIG } from "../../config";
import { resolveFrom } from "~/utils/file";
import { WalkBuilder } from "walkjs";
import fs from "node:fs";
import yaml from "yaml";
import { renderToFile } from "~/render";

const generateFrontendFile = async (
	name: string,
	fields: Record<string, string>,
) => {
	const outputPath = resolveFrom(CONFIG.slices.frontendTemplate);
	await renderToFile(
		outputPath,
		{
			name,
			fields,
		},
		`${name}.tsx`,
	);
};

export const generateFileset = (filesetName: string, filepath: string) => {
	const graph = yaml.parse(fs.readFileSync("./slices.yaml", "utf8"));

	const processSingleton = (singleton: any) => {
		const results: any[] = [];
		new WalkBuilder()
			.withGlobalFilter((a) => !!a.key) // do not walk root nodes (name of schema)
			.withSimpleCallback((node) => {
				const handled = handleField(String(node.key), node.val);
				if (handled !== undefined) {
					results.push(handled);
				}
			})
			.walk(singleton);

		return results;
	};

	const processed = Object.entries(graph).flatMap(([key, value]) => {
		return processSingleton(value);
	});

	console.log("processed::", processed);
};
