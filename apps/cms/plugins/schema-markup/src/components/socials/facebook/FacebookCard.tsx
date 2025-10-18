import { Card, Stack, Text, Box, Avatar, Flex } from "@sanity/ui";
import styles from "./FacebookCard.module.css";
import { truncate } from "../../../utils/string";
import type { PreviewCardProps } from "../../../types";
import SocialCardWrapper from "../../partials/SocialCardWrapper";

export function FacebookCard(props: PreviewCardProps) {
	const fallback = {
		title: "My Awesome Page",
		description:
			"This is an engaging summary preview of your content for Facebook! Enjoy maximum clickthrough.",
		image: "https://placehold.co/600x315",
		siteUrl: "mywebsite.com",
		author: "Your Brand",
		avatar: "https://placehold.co/40x40",
	};
	const data = { ...fallback, ...props };

	return (
		<SocialCardWrapper>
			<Flex gap={2} padding={3} className={styles.header}>
				<Avatar src={data.avatar} size={3} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{data.siteTitle}
					</Text>
					<Text size={1} muted>
						{data.siteUrl}
					</Text>
				</Stack>
			</Flex>
			<Box>
				<img className={styles.image} src={data.image} alt="Facebook preview" />
			</Box>
			<Box padding={3}>
				<Stack space={3}>
					<Text size={1} muted>
						{data.siteUrl}
					</Text>
					<Text weight="semibold" size={3}>
						{truncate(data.title, 60)}
					</Text>
					<Box marginTop={1}>
						<Text size={2}>{truncate(data.description, 110)}</Text>
					</Box>
				</Stack>
			</Box>
		</SocialCardWrapper>
	);
}

export default FacebookCard;
