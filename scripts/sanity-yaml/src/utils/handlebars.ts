import fs from "node:fs";
import Handlebars from "handlebars";
import { resolveFrom } from "./paths";
import { pascalCase } from "text-case";

export const registerPartials = (directory: string) => {
	const files = fs.readdirSync(resolveFrom(directory));

	for (const file of files) {
		const filePath = resolveFrom(file, directory);
		const fileName = file.split(".")[0];

		Handlebars.registerPartial(fileName, fs.readFileSync(filePath, "utf8"));
	}
};

export const registerHelpers = () => {
	Handlebars.registerHelper("eq", (a, b) => a === b);
	Handlebars.registerHelper("pascalCase", pascalCase);
	Handlebars.registerHelper("or", (...fnargs) => {
		// convert `arguments` into a normal array and remove the last item (Handlebars options object)
		const args = Array.from(fnargs).slice(0, -1);
		return args.some(Boolean);
	});
};
