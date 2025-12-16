import {
	mockCta,
	mockImage,
	mockLayout,
	mockSentence,
	mockWords,
} from "@local/mocks";
import { disableArgTypes } from "@local/utils";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
import UniversalHero from "./UniversalHero";

const meta = {
	component: UniversalHero,
	title: "Slices/Universal Hero",
} satisfies Meta<typeof UniversalHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		paragraph: mockSentence(),
		heading: mockWords(),
		buttons: [mockCta(), mockCta({ variant: "secondary" })],
		media: {
			type: "image",
			image: mockImage(),
		},
	},
	// argTypes: {
	// 	...disableArgTypes("buttons", "media", "styles", "layout"),
	// },
};
