// import { kebabCase, sentenceCase } from "text-case";
import { handleField } from "~/utils/field-handlers";

// import { resolveFrom } from "~/utils/file";
import { walk, WalkBuilder } from "walkjs";
import fs from "node:fs";
import yaml from "yaml";
import { FieldHandlerReturn, FilesetDataOutput } from "./types";
import { renderToFile } from "./utils/render";
import { titleCase } from "text-case";
// import { renderToFile } from "~/render";

// const generateFrontendFile = async (
// 	name: string,
// 	fields: Record<string, string>,
// ) => {
// 	const outputPath = resolveFrom(CONFIG. slices.frontendTemplate);
// 	await renderToFile(
// 		outputPath,
// 		{
// 			name,
// 			fields,
// 		},
// 		`${name}.tsx`,
// 	);
// };

const createSchema = (item: Record<string, unknown>) => {
	const fields: FieldHandlerReturn[] = [];
	walk(item, {
		onVisit: {
			filters: (node) => !!node.key,
			callback: (node) => {
				const field = handleField(String(node.key), node.val);

				if (field === undefined) return;
				// Skip the below scenarios to avoid adding fields to the parent array that have already been resolved in place as children of objects and arrays
				if (node.parent?.key?.includes("[]")) return;
				if (node.parent?.key && typeof node?.parent?.val === "object") return;

				fields.push(field);
			},
		},
	});

	// new WalkBuilder()
	// 	.withGlobalFilter((a) => !!a.key) // do not walk root nodes (name of schema)
	// 	.withSimpleCallback((node) => {})
	// 	.walk(item);

	return fields;
};

const createType = (schema: any) => {
	// console.log("schema::", schema);
	const root = {};

	new WalkBuilder()
		.withGlobalFilter((a) => !!a.key && a?.val?._PARAMS)
		.withSimpleCallback((node) => {
			const fieldName = node.val.name;
			const fieldType = node.val._PARAMS.type;

			switch (node.val.type) {
				case "object":
					const t = {};
					const fields = node.val.fields;

					fields.forEach((field, i) => {
						t[String(field.name)] = field._PARAMS.type;
					});

					root[fieldName] = t;

					break;
				case "array":
					const a = {};

					const of = node.val.of;

					of.forEach((o, i) => {
						a[String(o.type)] = o.type;
					});

					root[fieldName] = `${a}[]`;

					break;
				default:
					root[fieldName] = fieldType;
					break;
			}
		})
		.walk(schema);

	return root;
};

export const generateFileset = ({
	name,
	input,
	data,
	template,
	output,
}: {
	name: string;
	filepath: string;
	data: FilesetDataOutput;
	template: string;
	output: string;
}) => {
	const graph = yaml.parse(fs.readFileSync(input, "utf8"));

	const fileset = Object.entries(graph).flatMap(([key, value]) => {
		const schema = createSchema(value);
		const typeDefinition = createType(schema);

		return { name: key, schema, typeDefinition, title: titleCase(key) };
	});

	fileset.forEach((file, i) => {
		console.log("f:", file.schema);

		const templateData =
			{
				schema: { fields: file.schema, ...file },
				type: { types: file.typeDefinition, ...file },
			}[data as FilesetDataOutput] || {};

		renderToFile(template, templateData, output, `${file.name}.ts`);
	});

	// console.log("processed::", processed);
};
