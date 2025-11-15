import { createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { useKeypress } from "~/lib/hooks/useKeypress";
import { useWindowResize } from "~/lib/hooks/useWindowResize";

function getGridValues() {
	const computed = getComputedStyle(document.documentElement);
	const gutter = computed.getPropertyValue("--grid-gutter");
	const columns = computed.getPropertyValue("--grid-columns");
	const margin = computed.getPropertyValue("--grid-margin");

	return { gutter, columns, margin };
}

export default function Grid({}) {
	const [num, setNum] = createSignal(Array.from({ length: 12 }));

	const handleResize = () => {
		const { columns } = getGridValues(); // gx, gutter,
		setNum(Array.from({ length: +columns }));
	};

	useWindowResize(({ width, height }) => {
		console.log("resize", width, height);
	});

	// onMount(() => {
	// 	handleResize();
	// 	if (!isServer) window.addEventListener("resize", handleResize);

	// 	// get from localstorage
	// 	const grid = localStorage.getItem("grid");
	// 	if (grid) setVisible(grid === "true");
	// });

	// onCleanup(() => {
	// 	if (!isServer) window.removeEventListener("resize", handleResize);
	// });

	const [visible, setVisible] = createSignal(false);

	useKeypress(
		"g",
		() => {
			setVisible(!visible());
		},
		{
			shift: true,
		},
	);

	return (
		<div class="pointer-events-none z-9999 fixed inset-0 h-screen w-full">
			<div class="flex size-full px-margin-1 gap-gutter-1 grid-contain">
				{num().map((item) => {
					return <div class="bg-[red]/10 size-full"></div>;
				})}
			</div>
		</div>
	);
}
