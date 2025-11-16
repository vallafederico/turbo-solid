import type { GeneratorConfig } from "sanity-yaml";

const config: GeneratorConfig = {
	// Optional: Set default field options, only text is supported currently
	fieldDefaults: {
		text: {
			rows: 4, // Default rows for text fields
		},
	},

	// Optional: Remove defineField wrapper from generated fields
	// When true, fields will be plain objects instead of defineField() calls
	removeDefineField: false,

	// Required: Define your filesets
	filesets: {
		// Each fileset generates files for schemas in a YAML file
		yourFilesetName: {
			inputPath: "./schemas.yaml",
			onFileCreate: async ({
				name,
				sanityFields,
				typeDefinition,
				renderTemplate,
				modifyFile,
			}) => {
				await renderTemplate({
					templateFile: "./templates/{{name}}.hbs", // Template path supports Handlebars
					data: { name, sanityFields },
					outputPath: "../../packages/ui", // Output path supports Handlebars
				});

				await renderTemplate({
					templateFile: "./templates/{{kebabCase name}}-component.hbs",
					data: { name, typeDefinition },
					outputPath: `./generated/components/{{kebabCase name}}.tsx`,
				});

				await modifyFile({
					template:
						"import {{pascalCase name}} from './{{name}}/{{pascalCase name}}.tsx'\n",
					data: { name },
					targetFile: "./generated/schemas/index.ts",
					regex: "const sections = {", // Inserts import statement after this line
				});
			},
		},
	},
};

export default config;
