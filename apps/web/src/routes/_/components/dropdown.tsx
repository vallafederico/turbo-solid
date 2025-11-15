import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { animateAlpha } from "~/animation/alpha";
import Accordion from "~/components/Accordion/Accordion";
import Section from "~/components/Section";

export default function SplitTextPage() {
	return (
		<div class="min-h-[100vh] py-20">
			<Title>Split Text</Title>

			<div use:animateAlpha>
				<Section class="px-margin-1">
					<A href="/components">Back</A>
				</Section>
			</div>

			<div class="flex-center max-w-screen py-20">
				<Accordion name="accordion-1" title="Dropdown Mcgee">
					<p>
						Incididunt dolore amet cillum duis velit ullamco amet. Nostrud culpa
						duis non fugiat officia labore. Exercitation excepteur velit ea
						velit laboris id velit ea do do. Irure elit qui veniam ad ullamco
						adipisicing duis dolor duis.
					</p>
				</Accordion>
			</div>
		</div>
	);
}
