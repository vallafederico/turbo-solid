import { Show } from "solid-js";

interface UniversalHeroProps {
	heading?: string;
	paragraph?: string;
	eyebrow?: string;
}

export default function UniversalHero({
	heading,
	paragraph,
	eyebrow,
}: UniversalHeroProps) {
	return (
		<header class="h-screen w-full bg-black">
			<hgroup class="z-2 absolute bottom-40 w-grid-5 left-40 w-full text-white">
				<Show when={eyebrow}>
					<p class="text-[1.4rem] mb-30 font-bold uppercase opacity-60">
						{eyebrow}
					</p>
				</Show>
				<Show when={heading}>
					<h1 class="text-[8rem] !leading-[0.92] font-bold">{heading}</h1>{" "}
				</Show>
				<Show when={paragraph}>
					<p class="text-[2rem] !leading-[1.1] mt-30">{paragraph}</p>
				</Show>
			</hgroup>
			<img
				src="https://picsum.photos/1200/1300"
				alt="Thingy"
				class="w-full h-full object-cover opacity-80 z-1"
			/>
		</header>
	);
}
