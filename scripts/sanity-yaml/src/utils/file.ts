import fs from "node:fs/promises";
import Handlebars from "handlebars";
import { isAbsolute, resolve } from "node:path";
import { normalize } from "node:path";

export function resolveFrom(userPath, base = process.cwd()) {
	if (!userPath) throw new Error("No Path Provided");
	return isAbsolute(userPath)
		? normalize(userPath)
		: normalize(resolve(base, userPath));
}

export const createFile = async (filePath: string, content: string) => {
	return fs.writeFile(filePath, content);
};

export const getCompiledTemplate = async (templateName: string) => {
	const target = resolveFrom(templateName);

	const template = await fs.readFile(target, "utf8");


	return Handlebars.compile(template);
};
