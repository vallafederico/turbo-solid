import addonA11y from "@storybook/addon-a11y";
import addonDocs from "@storybook/addon-docs";
import { definePreview } from "storybook-solidjs-vite";

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
	addons: [addonDocs(), addonA11y()],
	parameters: {
		// automatically create action args for all props that start with 'on'
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
		docs: {
			source: { type: "code" },
		},
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
		options: {
			storySort: (a, b) =>
				a.id === b.id
					? 0
					: a.id.localeCompare(b.id, undefined, { numeric: true }),
		},
		// viewport: {
		// 	// options: {
		// 	// 	...customViewports,
		// 	// },
		// },
		decorators: [
			(Story) => {
				// useScrollbarWidth();

				return (
					<div
						style={{
							display: "flex",
							"min-height": "100vh",
							width: "100%",
							"justify-content": "center",
							"align-items": "center",
						}}
						class="bg-[#F4F4F4]"
						data-wrapper
					>
						<Story />
					</div>
				);
			},
		],
	},
	// All components will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	// tags: ['autodocs'],
});
