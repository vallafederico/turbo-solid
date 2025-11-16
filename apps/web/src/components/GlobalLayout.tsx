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
		if (!el || isServer) return 0;
		return window.innerWidth - el.offsetWidth;
	};

	onMount(() => {
		setCssVariable("--scrollbar", `${getScrollbarWidth()}px`);
	});

	useWindowResize(() => {
		setCssVariable("--scrollbar", `${getScrollbarWidth()}px`);
	});

	return (
		<>
			<div class="" />
			<Nav />
			<main ref={el} use:scroll>
				{children}
			</main>
		</>
	);
};

export default GlobalLayout;
