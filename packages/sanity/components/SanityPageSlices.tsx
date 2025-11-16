// append

import { lazy } from "solid-js";
import { SanityComponents } from "..";

const SANITY_PAGE_SLICES = {};

export default function SanityPageSlices({ slices }: { slices: any[] }) {
	return (
		<SanityComponents components={slices} componentList={SANITY_PAGE_SLICES} />
	);
}
