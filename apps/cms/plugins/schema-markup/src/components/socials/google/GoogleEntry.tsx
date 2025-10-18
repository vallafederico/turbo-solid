import { Card, Stack, Text, Box, Flex, Avatar } from "@sanity/ui";
import styles from "./GoogleEntry.module.css";
import { truncate } from "../../../utils/string";
import type { PreviewCardProps } from "../../../types";
import { useRootTheme } from "@sanity/ui";
import SocialCardWrapper from "../../partials/SocialCardWrapper";

export function GoogleEntry(props: PreviewCardProps) {
	const fallback = {
		title: "My Awesome Page - MyWebsite",
		description:
			"A compelling meta description for Google search snippet. Explain what users can find inside!",
		siteUrl: "https://mywebsite.com/page",
		favicon: "https://placehold.co/32x32", // fallback favicon
	};

	const data = { ...fallback, ...props };
	const theme = useRootTheme();

	return (
		<SocialCardWrapper>
			<Box padding={3}>
				<Stack space={3}>
					<Flex align="center" marginBottom={2} gap={2}>
						<Avatar size={2} src={data.favicon} alt="Favicon" />
						<Stack space={2}>
							<Text size={1} weight="semibold" className={styles.site}>
								{data.siteTitle}
							</Text>
							<Text size={1} muted className={styles.site}>
								{data.siteUrl}
							</Text>
						</Stack>
					</Flex>
					<Text
						style={{
							color: theme.scheme === "light" ? "#1D11AC" : "#99C2FF",
						}}
						weight="medium"
						size={3}
						className={styles.title}
					>
						{truncate(data.title, 60)}
					</Text>
					<Text size={2} muted className={styles.desc}>
						{truncate(data.description, 155)}
					</Text>
				</Stack>
			</Box>
		</SocialCardWrapper>
	);
}

export default GoogleEntry;
