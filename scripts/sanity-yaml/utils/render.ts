import { readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import { getCompiledTemplate } from "./file";
import type { TemplateData } from "../types";

export const renderToFile = async (
	templateName: string,
	data: TemplateData,
	outputName: string,
) => {
	// 1) Load template + data
	const templateFile = await getCompiledTemplate(templateName);
	const renderedTemplate = templateFile(data);

	// console.log("🔥 Rendered template: ", renderedTemplate);

	// 3) Write output
	await mkdir(`${__dirname}/dist`, { recursive: true });
	await writeFile(
		`${__dirname}/dist/${outputName}.ts`,
		renderedTemplate,
		"utf8",
	);

	// console.log("✔ Rendered to dist/output.html");
};
