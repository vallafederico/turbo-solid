import { onCleanup, onMount } from "solid-js";
import { Gl, setGui } from "@local/three";
import { Gui } from "~/lib/utils/gui";
import { assets } from "~/assets";

export default function Canvas() {
	const webgl = (self: HTMLElement) => {
		onMount(() => {
			// Set up Gui for webgl package
			setGui(Gui);
			// Start Gl with assets
			Gl.start(self, assets);
		});

		onCleanup(() => {
			Gl.destroy();
		});
	};

	return <div use:webgl class="fixed inset-0 z-[-1] h-screen w-full"></div>;
}
