import cx from "classix";
import { createSignal, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { useKeypress } from "~/lib/hooks/useKeypress";
import { useWindowResize } from "~/lib/hooks/useWindowResize";

function getColumnCount() {
	const computed = getComputedStyle(document.documentElement);
	const columns = computed.getPropertyValue("--grid-columns");

	return columns;
}

export default function Grid() {
	const [visible, setVisible] = createSignal(false);
	const [columns, setColumns] = createSignal(1);

	const handleResize = () => {
		const cols = getColumnCount(); // gx, gutter,
		setColumns(+cols);
	};

	onMount(() => {
		handleResize();
	});

	useWindowResize(handleResize);

	useKeypress("x", () => {
		setVisible(!visible());
	});

	return (
		<div
			class={cx(
				"pointer-events-none z-9999 fixed inset-0 h-screen w-full",
				visible() ? "block" : "hidden",
			)}
		>
			<div class="flex size-full px-margin-1 gap-gutter-1 grid-contain">
				{Array.from({ length: columns() }).map((item) => {
					return <div class="bg-[red]/10 size-full"></div>;
				})}
			</div>
		</div>
	);
}
