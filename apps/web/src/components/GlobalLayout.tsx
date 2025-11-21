import { scroll, usePageTransition } from "@local/animation";
import { onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { useWindowResize } from "~/lib/hooks/useWindowResize";
import { setCssVariable } from "~/lib/utils/css";
import { Nav } from "./Nav";

const GlobalLayout = ({ children, ...props }: { children: any }) => {
	// biome-ignore lint/style/useConst: <explanation>
	let el: HTMLElement | null = null;
	usePageTransition();

	const getScrollbarWidth = () => {
		if (!el || isServer) return "0px";
		const width = window.innerWidth - el.offsetWidth;
		return `${width}px`;
	};

	onMount(() => {
		setCssVariable("--scrollbar", getScrollbarWidth());
	});

	useWindowResize(() => {
		setCssVariable("--scrollbar", getScrollbarWidth());
	});

	return (
		<>
			<Nav />
			<main class="text-[1.5rem]" ref={el} use:scroll>
				{children}
			</main>
		</>
	);
};

export default GlobalLayout;
