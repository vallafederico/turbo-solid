import fs from "node:fs";
import yaml from "yaml";
import { Eta } from "eta";
import path from "node:path";

// Create an Eta instance
const eta = new Eta({ views: path.resolve("templates") });

// Add camelCase and PascalCase filters
eta.configure({
	views: path.join(__dirname, "templates"),
	// filters: {
	// 	camel: camelCaseFilter,
	// 	pascal: pascalCaseFilter,
	// },
});

const slices = yaml.parse(fs.readFileSync("./slices.yaml", "utf8"));

console.log(slices);

// const pages = yaml.parse(fs.readFileSync("./pages.yaml", "utf8"));
