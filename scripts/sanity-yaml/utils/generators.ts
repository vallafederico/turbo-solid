import { kebabCase, sentenceCase } from "text-case";
import { handleField } from "./field-handlers";
import { renderToFile } from "./render";
import { CONFIG } from "../config";
import { resolveFrom } from "./file";
import { WalkBuilder } from "walkjs";
import fs from "node:fs";
import yaml from "yaml";

const TYPE_TRANSFORMERS = {
	datetime: "Date",
	date: "Date",
	url: "String",
	email: "String",
	string: ({ options }) => {
		if (Array.isArray(options?.list)) {
			return `'${options.list.map((option) => `'${option}'`).join(" | ")}'`;
		}

		return "String";
	},
};

export const fieldToTypeDefinition = (field: any) => {
	const typeTransformer = TYPE_TRANSFORMERS[field.type];
	const definition =
		typeof typeTransformer === "function"
			? typeTransformer(field?.type)
			: typeTransformer || field.type;

	return definition;
};

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
		const processed = new WalkBuilder()
			.withGlobalFilter((a) => a.key)
			.withSimpleCallback((node) => {
				// console.log(val);
				// console.log("v::", { val: node.val, key: node.key });

				node.val = handleField(node.key, node.val);

				console.log("n::", node.val);
			})
			.walk(singleton);

		return processed;
	};

	const processed = Object.entries(graph).map(([key, value]) => {
		return processSingleton(value);
	});

	console.log(processed);
};
