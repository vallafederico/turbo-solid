import { readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { writeFile } from "node:fs/promises";

import type { TemplateData } from "~/types";
import { getCompiledTemplate } from "./paths";

export const renderToFile = async (
	templateName: string,
	data: TemplateData,
	outputPath: string,
	outputName: string,
) => {
	console.log(data);
	// 1) Load template + data
	const templateFile = await getCompiledTemplate(templateName);
	const renderedTemplate = templateFile(data);

	// 3) Write output
	await mkdir(`${__dirname}/dist`, { recursive: true });
	await writeFile(`${__dirname}/dist/${outputName}`, renderedTemplate, "utf8");
};
