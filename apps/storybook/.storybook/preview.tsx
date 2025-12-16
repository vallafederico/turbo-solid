import {
	createDecorator,
	createJSXDecorator,
	definePreview,
} from "storybook-solidjs-vite";
import "../../web/src/app.css";

const customViewports = {
	"xl-desktop": {
		name: "1920 • XL Desktop",
		type: "desktop",
		styles: {
			width: "1920px",
			height: "1080px",
		},
	},
	"large-desktop": {
		name: "1440 • LG Desktop",
		type: "desktop",
		styles: {
			width: "1440px",
			height: "900px",
		},
	},
	"small-desktop": {
		name: "1024 • SM Desktop",
		type: "desktop",
		styles: {
			width: "1024px",
			height: "700px",
		},
	},
	tablet: {
		name: "768 • Tablet",
		type: "tablet",
		styles: {
			width: "768px",
			height: "1024px",
		},
	},
	mobile: {
		name: "390 • Mobile",
		type: "mobile",
		styles: {
			width: "390px",
			height: "844px",
		},
	},
};

export default definePreview({
	addons: [],
	parameters: {
		actions: {
			argTypesRegex: "^on.*",
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: "fullscreen",
		options: {
			storySort: (a, b) =>
				a.id === b.id
					? 0
					: a.id.localeCompare(b.id, undefined, { numeric: true }),
		},
		viewport: {
			options: {
				...customViewports,
			},
		},
	},
	decorators: [storyDecorator],
});
