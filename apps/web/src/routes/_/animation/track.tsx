import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";
import Track from "~/components/animation/Track";
import Section from "~/components/Section";

export default function TrackPage() {
	return (
		<div class="min-h-[100vh] py-20">
			<Title>Track</Title>

			<Section class="px-margin-1">
				<A href="/_/animation">Back</A>
			</Section>

			<div
				use:animateAlpha
				class="py-20 overflow-clip flex-center max-w-screen"
			>
				<Section class="w-full py-[100vh]">
					<Track class="">hello</Track>
				</Section>
			</div>
		</div>
	);
}
