import { Button, Flex, Box, Text } from "@sanity/ui";
import { useState } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import { useFormValue, type ObjectInputProps } from "sanity";
import FacebookCard from "../../socials/facebook/FacebookCard";
import TwitterCard from "../../socials/twitter/TwitterCard";
import GoogleEntry from "../../socials/google/GoogleEntry";
import { PreviewGroup } from "./PreviewGroup";

const PREVIEW_GROUPS = [
	{
		name: "Facebook",
		component: FacebookCard,
		title: "Facebook",
	},
	{
		name: "Twitter",
		component: TwitterCard,
		title: "Twitter",
	},
	{
		name: "Google",
		component: GoogleEntry,
		title: "Google",
	},
];

export default function PageSeoInput(props: ObjectInputProps) {
	const MODES = [
		{ name: "fields", title: "Fields", icon: MdEdit },
		{ name: "preview", title: "Preview", icon: MdPreview },
	];

	type SeoInputMode = (typeof MODES)[number];

	const [currentMode, setCurrentMode] = useState<SeoInputMode["name"]>(
		MODES[0]?.name,
	);

	const g = useFormValue(props.path);
	console.log(g);

	const seoData = props.value as Seo;

	return (
		<div>
			<Box marginY={2}>
				<Flex gap={2}>
					{MODES.map((m: SeoInputMode) => (
						<Box key={m.name}>
							<Button
								padding={1}
								icon={m.icon}
								mode={m.name === currentMode ? "default" : "ghost"}
								onClick={() => setCurrentMode(m.name)}
							>
								{m.title}
							</Button>
						</Box>
					))}
				</Flex>
			</Box>

			{currentMode === "fields" && props.renderDefault(props)}
			{currentMode === "preview" && (
				<Flex gap={7} marginTop={6} direction="column">
					{PREVIEW_GROUPS.map((group) => (
						<PreviewGroup key={group.name} title={group.title}>
							<group.component {...seoData} />
						</PreviewGroup>
					))}
				</Flex>
			)}
		</div>
	);
}
