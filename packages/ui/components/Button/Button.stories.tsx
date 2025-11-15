// import { disableArgTypes } from "@local/utils";
// import type { Meta, StoryObj } from "@storybook/nextjs";
import Button from "./Button";

const meta = {
	component: Button,
	title: "Components/Button",
};

export default meta;
// type Story = StoryObj<typeof meta>;

// Primary Variant
export const Primary = {
	args: {
		label: "Click me",
	},
	argTypes: {
		// ...sharedArgTypes,
		// variant: {
		// 	options: ["primary"],
		// 	control: { type: "select" },
		// 	table: { disable: true },
		// },
		label: {
			name: "Label",
			control: "text",
		},
	},
};
