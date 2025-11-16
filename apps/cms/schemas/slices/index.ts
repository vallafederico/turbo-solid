// append

import { createSliceSet } from "../../utils/create";
import header from "./header";
import richText from "./richText";

const globalPageSlices = [header, richText] as any[] as Slice[];

const slices = createSliceSet({
	name: "pageSlices",
	title: "Page Slices",
	slices: globalPageSlices,
});

export default [slices, ...globalPageSlices];
