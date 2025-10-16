// import { kebabCase, sentenceCase } from "text-case";
import { handleField } from "~/utils/field-handlers";

// import { resolveFrom } from "~/utils/file";
import { WalkBuilder } from "walkjs";
import fs from "node:fs";
import yaml from "yaml";
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
	const results: any[] = [];
	new WalkBuilder()
		// .withGlobalFilter((a) => !!a.key) // do not walk root nodes (name of schema)
		.withSimpleCallback((node) => {
			const handled = handleField(String(node.key), node.val);
			if (handled !== undefined) {
				results.push(handled);
			}
		})
		.walk(item);

	console.log("results::", results);

	return results;
};

const createType = (schema: any) => {
	const root = {};

	new WalkBuilder()
		.withGlobalFilter((a) => !!a.key && a?.val?._PARAMS)
		.withSimpleCallback((node) => {
			// console.log(node.val);

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

	// console.log("root::", root);

	return root;
};

export const generateFileset = (filesetName: string, filepath: string) => {
	const graph = yaml.parse(fs.readFileSync("./slices.yaml", "utf8"));

	const processed = Object.entries(graph).flatMap(([key, value]) => {
		const schema = createSchema(value);
		const type = createType(schema);

		return { schema, type };
	});

	// console.log("processed::", processed);
};
