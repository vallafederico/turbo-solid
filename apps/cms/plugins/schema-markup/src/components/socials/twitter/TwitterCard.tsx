import { Card, Stack, Text, Box, Avatar, Flex } from "@sanity/ui";
import styles from "./TwitterCard.module.css";
import { truncate } from "../../../utils/string";
import type { PreviewCardProps } from "../../../types";

export function TwitterCard(props: PreviewCardProps) {
	const fallback = {
		siteTitle: "Why Static Site Generators Rock",
		description:
			"Exploring the benefits of JAMstack and web dev with static content. Fast, secure, scalable.",
		image: "https://placehold.co/800x418",
		siteUrl: "mywebsite.com",
		username: "@yoursite",
		avatar: "https://placehold.co/40x40",
	};
	const data = {
		...fallback,
		...props,
	};
	return (
		<Card className={styles.twitterCard} radius={2} shadow={1} tone="default">
			<Flex gap={2} padding={3} className={styles.userRow}>
				<Avatar src={data.avatar} size={3} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{data.siteTitle}
					</Text>
					<Text size={1} muted>
						{data.twitterHandle}
					</Text>
				</Stack>
			</Flex>
			<Box>
				<img
					className={styles.imageLarge}
					src={data.image}
					alt="Twitter preview"
				/>
			</Box>
			<Box padding={3}>
				<Flex direction="column" gap={4}>
					<Text size={1} muted>
						{data.siteUrl}
					</Text>
					<Text weight="semibold" size={3}>
						{truncate(data.title, 70)}
					</Text>
					<Text size={2}>{truncate(data.description, 120)}</Text>
				</Flex>
			</Box>
		</Card>
	);
}

export default TwitterCard;
