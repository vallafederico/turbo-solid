import { Button, Flex, Box, Text } from "@sanity/ui";
import { useEffect, useState } from "react";
import { MdEdit, MdPreview } from "react-icons/md";
import { useClient, useFormValue, type ObjectInputProps } from "sanity";
import FacebookCard from "../../socials/facebook/FacebookCard";
import TwitterCard from "../../socials/twitter/TwitterCard";
import GoogleEntry from "../../socials/google/GoogleEntry";
import { PreviewGroup } from "./PreviewGroup";
import { concatenatePageTitle } from "../../../utils/string";
import ButtonWithIcon from "../../partials/ButtonWithIcon";

const PREVIEW_GROUPS = [
	{
		name: "Facebook",
		component: FacebookCard,
		title: "Facebook",
	},
	{
		name: "Twitter / X",
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
	const client = useClient({ apiVersion: "2025-01-11" });
	const MODES = [
		{ name: "fields", title: "Fields", icon: MdEdit },
		{ name: "preview", title: "Preview", icon: MdPreview },
	];

	type SeoInputMode = (typeof MODES)[number];

	const [currentMode, setCurrentMode] = useState<SeoInputMode["name"]>(
		MODES[0]?.name,
	);
	const [seoDefaults, setSeoDefaults] = useState<any>(null);

	useEffect(() => {
		client.fetch(`*[_type == "seoDefaults"][0]`).then(setSeoDefaults);
	}, [client]);

	const document = useFormValue([]) || {};

	const seoData = {
		...(seoDefaults || {}),
		...(props.value || {}),
		title: concatenatePageTitle(
			document?.title,
			seoDefaults?.siteTitle,
			seoDefaults?.pageTitleTemplate,
		),
		// merge description or other fields as needed
	};

	return (
		<div>
			<Box marginBottom={4} width="fill">
				<Flex gap={2} width="fill">
					{MODES.map((m: SeoInputMode) => (
						<ButtonWithIcon
							key={m.name}
							buttonProps={{
								padding: 2,
								width: "fill",
								mode: m.name === currentMode ? "default" : "ghost",
								onClick: () => setCurrentMode(m.name),
							}}
							label={m.title}
							icon={m.icon}
						/>
					))}
				</Flex>
			</Box>

			{currentMode === "fields" && props.renderDefault(props)}
			{currentMode === "preview" && (
				<Flex gap={6} marginTop={6} direction="column">
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
