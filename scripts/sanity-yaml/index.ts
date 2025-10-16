import { registerPartials } from "./src/utils/handlebars";
import { registerHelpers } from "./src/utils/handlebars";
import { generateFileset } from "~/generators";

// const slices = yaml.parse(fs.readFileSync("./slices.yaml", "utf8"));

registerHelpers();
registerPartials("./templates/partials");
generateFileset("slices", "./slices.yaml");
