import { createStore } from "solid-js/store";

const [viewport, setViewport] = createStore({
	size: {
		width: 0,
		height: 0,
	},
});

export { viewport, setViewport };
