import { animateAlpha } from "~/animation/alpha";
import Section from "~/components/Section";

export default function GridExample() {
	return (
		<Section class="px-margin-1 flex h-[80svh] w-full flex-col gap-2">
			<h1 class="flex-center" use:animateAlpha>
				Grid system
			</h1>
			<p use:animateAlpha class="text-center">
				use X to toggle grid view
			</p>

			<div
				use:animateAlpha
				class="flex flex-col gap-2 [&_div]:border [&_div]:border-gray-800"
			>
				<div class="w-grid-1">
					<h2>One</h2>
				</div>
				<div class="w-grid-2 ml-grid-1-w">
					<h2>Two</h2>
				</div>
				<div class="w-grid-3 ml-grid-3-w">
					<h2>Three</h2>
				</div>
				<div class="w-grid-4 ml-grid-4-w">
					<h2>Four</h2>
				</div>
				<div class="w-grid-5 ml-grid-5-w">
					<h2>Five</h2>
				</div>
				<div class="w-grid-6 ml-grid-6-w">
					<h2>Six</h2>
				</div>
				<div class="w-grid-7 ml-grid-1-w">
					<h2>Seven</h2>
				</div>
				<div class="w-grid-8 ml-grid-2-w">
					<h2>Eight</h2>
				</div>
				<div class="w-grid-9 ml-grid-3-w">
					<h2>Nine</h2>
				</div>
				<div class="w-grid-10">
					<h2>Ten</h2>
				</div>
				<div class="w-grid-11">
					<h2>Eleven</h2>
				</div>
				<div class="w-grid-12">
					<h2>Twelve</h2>
				</div>
			</div>
		</Section>
	);
}
