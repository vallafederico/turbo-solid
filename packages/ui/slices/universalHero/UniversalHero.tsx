import { Show } from "solid-js";

interface UniversalHeroProps {
	heading: string;
	paragraph: string;
}

export default function UniversalHero({
	heading = "Deserunt eu magna aliqua reprehenderit.",
	paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}: UniversalHeroProps) {
	return (
		<header class="h-screen w-full bg-black">
			<hgroup class="absolute bottom-20 w-grid-5 left-20 w-full text-center text-white">
				<Show when={heading}>
					<h1>{heading}</h1>{" "}
				</Show>
				<h1>{heading}</h1>
				<Show when={paragraph}>
					<p>{paragraph}</p>
				</Show>
			</hgroup>
		</header>
	);
}
