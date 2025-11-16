import type { GeneratorConfig } from "sanity-yaml";

const config: GeneratorConfig = {
	fieldDefaults: {
		text: {
			rows: 3,
		},
	},

	filesets: {
		taxonomies: {
			inputPath: "./filegen/taxonomies.yaml",
			onFileCreate: async ({
				name,
				sanityFields,
				typeDefinition,
				renderTemplate,
				modifyFile,
			}) => {
				await renderTemplate({
					templateFile: "./filegen/templates/taxonomy-schema.hbs",
					data: { name, sanityFields, typeDefinition },
					outputPath: "../../apps/cms/schemas/taxonomies/{{camelCase name}}.ts",
				});

				await modifyFile({
					template: "\nimport {{camelCase name}} from './{{camelCase name}}'",
					data: { name },
					regex: "// append",
					targetFile: "../../apps/cms/schemas/taxonomies/index.ts",
				});

				await modifyFile({
					template: "{{camelCase name}},",
					data: { name },
					regex: "export default [",
					targetFile: "../../apps/cms/schemas/taxonomies/index.ts",
				});
			},
		},
		pages: {
			inputPath: "./filegen/pages.yaml",
			onFileCreate: async ({
				name,
				sanityFields,
				typeDefinition,
				renderTemplate,
				modifyFile,
			}) => {
				await renderTemplate({
					templateFile: "./filegen/templates/page-schema.hbs",
					data: { name, sanityFields, typeDefinition },
					outputPath: "../../apps/cms/schemas/pages/{{camelCase name}}.ts",
				});

				await modifyFile({
					template: "\nimport {{camelCase name}} from './{{camelCase name}}'",
					data: { name },
					regex: "// append",
					targetFile: "../../apps/cms/schemas/pages/index.ts",
				});
			},
		},
		// slices: {
		// 	inputPath: "./filegen/slices.yaml",
		// 	onFileCreate: async ({
		// 		name,
		// 		sanityFields,
		// 		typeDefinition,
		// 		renderTemplate,
		// 		modifyFile,
		// 	}) => {
		// 		// FRONTEND

		// 		// Generate component file
		// 		await renderTemplate({
		// 			templateFile: "./filegen/templates/slice-component.hbs",
		// 			data: { name, sanityFields, typeDefinition },
		// 			outputPath:
		// 				"../../packages/ui/{{camelCase name}}/{{pascalCase name}}.tsx",
		// 		});

		// 		// Generate story file
		// 		await renderTemplate({
		// 			templateFile: "./filegen/templates/slice-story-component.hbs",
		// 			data: { name, sanityFields, typeDefinition },
		// 			outputPath:
		// 				"../../packages/ui/{{camelCase name}}/{{pascalCase name}}.stories.tsx",
		// 		});

		// 		// Add to frontend slice map
		// 		await modifyFile({
		// 			template:
		// 				"{{camelCase name}}: lazy(() => import('./{{name}}/{{pascalCase name}}.tsx')),\n",
		// 			data: { name },
		// 			regex: "const SANITY_PAGE_SLICES = {",
		// 			targetFile: "./components/SanityPageSlices.tsx",
		// 		});

		// 		// SCHEMAS IN SANITY

		// 		// Generate schema file
		// 		await renderTemplate({
		// 			templateFile: "./filegen/templates/slice-schema.hbs",
		// 			data: { name, sanityFields },
		// 			outputPath: "../../apps/cms/schemas/slices/{{camelCase name}}.ts",
		// 		});

		// 		// Import into slice list
		// 		await modifyFile({
		// 			template: "\nimport {{camelCase name}} from './{{camelCase name}}'",
		// 			data: { name },
		// 			targetFile: "../../apps/cms/schemas/slices/index.ts",
		// 			regex: "// append",
		// 		});

		// 		// Add to slice list
		// 		await modifyFile({
		// 			template: "{{camelCase name}},",
		// 			data: { name },
		// 			targetFile: "../../apps/cms/schemas/slices/index.ts",
		// 			regex: /const globalPageSlices = \[/,
		// 		});
		// 	},
		// },
	},
};

export default config;
