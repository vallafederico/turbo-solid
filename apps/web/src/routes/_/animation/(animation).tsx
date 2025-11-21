import { SanityMeta } from "@local/seo";
import { Button } from "@local/ui";
import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";

import { animateAlpha } from "~/animation/alpha";
import Section from "~/components/Section";

export default function Animation() {
	return (
		<div class="min-h-[100vh] py-20">
			<Title>About</Title>
			<SanityMeta isHomepage={false} />
			<Button />
			<Section class="">
				<div
					use:animateAlpha
					class="px-margin-1 flex flex-col items-start gap-4"
				>
					<h2>Animation </h2>
					<ul class="mt-6 flex flex-col items-start gap-3">
						<li>
							<A animate-hover="underline" href="/_/animation/slider">
								Slider
							</A>
						</li>
						<li>
							<A animate-hover="underline" href="/_/animation/track">
								Track
							</A>
						</li>
						<li>
							<A animate-hover="underline" href="/_/animation/split-text">
								Split Text
							</A>
						</li>
					</ul>
				</div>
			</Section>
		</div>
	);
}
