// import { disableArgTypes } from "@local/utils";
// import type { Meta, StoryObj } from "@storybook/nextjs";
import Button from "./Button";

const meta = {
	component: Button,
	title: "Components/Button",
};

export default meta;
// type Story = StoryObj<typeof meta>;

const sharedArgTypes = {
	// ...disableArgTypes("variant", "className", "href", "onClick"),

	label: {
		name: "Label",
		control: "text",
	},
};

// Primary Variant
export const Primary: Story = {
	args: {
		variant: "primary",
		disabled: false,
		size: "lg",
		label: "Click me",
	},
	argTypes: {
		...sharedArgTypes,
		variant: {
			options: ["primary"],
			control: { type: "select" },
			table: { disable: true },
		},
	},
};
