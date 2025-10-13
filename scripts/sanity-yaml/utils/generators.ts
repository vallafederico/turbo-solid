import fs from "node:fs/promises";
import path from "node:path";
import * as eta from "eta";
import { kebabCase } from "text-case";

// Assuming eta is configured elsewhere and imported if needed

export const generateSlices = async (slices: {
	[key: string]: { name: string; type: string }[];
}) => {
	let generated = 0;

	// async map over Object.entries
	await Promise.all(
		Object.entries(slices).map(async ([key, fields], i) => {
			const _type = key;

			const filename = kebabCase(_type);

			// Render the template asynchronously
			// Assuming you have an eta instance configured and a template named "sanity-slice"
			const fileContent = await eta.renderFile("sanity-slice", {
				name: _type,
				fields,
			});

			if (typeof fileContent === "string") {
				// Write fileContent to file, e.g., to 'output/slices/<slice name>.ts'
				const filePath = path.join("output", "slices", `${_type}.ts`);
				await fs.mkdir(path.dirname(filePath), { recursive: true });
				await fs.writeFile(filePath, fileContent, "utf8");
				generated++;
			}
		}),
	).then(() => {
		console.log(`${generated} slices generated ✅`);
	});
};
