import { Title } from "@solidjs/meta";
import { cache, createAsync } from "@solidjs/router";
import { createEffect, createResource, Show } from "solid-js";
import { animateAlpha } from "~/animation/alpha.js";
import Section from "~/components/Section";

// (*) how does this work?

async function wait(time = 1): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 1000 * time);
	});
}

const getContent = cache(async () => {
	"use server";
	console.log("loading...");
	await Promise.all([wait(1.5), wait(0.5)]);
	return {
		hello: "world",
	};
}, "loadeddata");

export const route = {
	preload: async () => await getContent(),
};

export default function Data() {
	const [loadeddata] = createResource(() => getContent());

	return (
		<div class="min-h-[100vh] pt-20">
			{/* <Title>{loadeddata().hello}</Title> */}
			<Section class="px-margin-1">
				<div>The next bit is data</div>
				<Show when={loadeddata()}>
					<div>{loadeddata().hello}</div>
				</Show>
			</Section>
		</div>
	);
}
