import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";
import Split from "~/components/animation/Split";
import Section from "~/components/Section";

export default function SplitTextPage() {
	return (
		<div class="min-h-[100vh] py-20">
			<Title>Split Text</Title>

			<div use:animateAlpha>
				<Section class="px-margin-1">
					<A href="/_/animation">Back</A>
				</Section>
			</div>

			<div class="flex-center max-w-screen py-20">
				<Split class="text-[2rem]">
					<p class="">Split me Gg yl</p>
				</Split>
			</div>
			<div class="flex-center min-h-[100vh] max-w-screen py-20">
				<Split class="text-[2rem]">
					<p class="">Cool text here</p>
				</Split>
			</div>
			<div class="flex-center max-w-screen py-20">
				<Split class="text-[2rem]">
					<p class="">Split me PLEASE</p>
				</Split>
			</div>
		</div>
	);
}
