import { Card, Stack, Text, Box, Avatar } from "@sanity/ui";
import styles from "./TwitterCard.module.css";
import { truncate } from "../../../utils/truncate";

export interface TwitterCardProps {
	title?: string;
	description?: string;
	image?: string;
	site?: string;
	username?: string;
	avatar?: string;
}

export function TwitterCard(props: TwitterCardProps) {
	const fallback = {
		title: "Why Static Site Generators Rock",
		description:
			"Exploring the benefits of JAMstack and web dev with static content. Fast, secure, scalable.",
		image: "https://placehold.co/800x418",
		site: "mywebsite.com",
		username: "@yoursite",
		avatar: "https://placehold.co/40x40",
	};
	const data = {
		...fallback,
		...props,
	};
	return (
		<Card className={styles.twitterCard} radius={2} shadow={1} tone="default">
			<Box padding={3} className={styles.userRow}>
				<Avatar src={data.avatar} size={1} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{data.site}
					</Text>
					<Text size={1} muted>
						{data.username}
					</Text>
				</Stack>
			</Box>
			<Box>
				<img
					className={styles.imageLarge}
					src={data.image}
					alt="Twitter preview"
				/>
			</Box>
			<Box padding={3}>
				<Stack space={2}>
					<Text weight="semibold" size={3}>
						{truncate(data.title, 70)}
					</Text>
					<Text size={2}>{truncate(data.description, 120)}</Text>
				</Stack>
			</Box>
		</Card>
	);
}

export default TwitterCard;
