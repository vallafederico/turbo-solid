import fs from "node:fs";
import yaml from "yaml";

import { registerPartials } from "./utils/handlebars";
import { registerHelpers } from "./utils/handlebars";
import { generateFileset } from "./utils/generators";

// const slices = yaml.parse(fs.readFileSync("./slices.yaml", "utf8"));

registerHelpers();
registerPartials("./templates/partials");
generateFileset("slices", "./slices.yaml");
