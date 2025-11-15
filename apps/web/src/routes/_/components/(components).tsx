import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";
import Section from "~/components/Section";

export default function Components() {
	return (
		<div class="min-h-[100vh] py-20">
			<Title>Components</Title>
			<Section class="">
				<div
					use:animateAlpha
					class="px-margin-1 flex flex-col items-start gap-4"
				>
					<h2>Components </h2>
					<ul class="mt-6 flex flex-col items-start gap-3">
						<li>
							<A animate-hover="underline" href="/_/components/dropdown">
								Dropdown
							</A>
						</li>
					</ul>
				</div>
			</Section>
		</div>
	);
}
