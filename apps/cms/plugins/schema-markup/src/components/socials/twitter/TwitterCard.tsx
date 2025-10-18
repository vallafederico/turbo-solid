import { Card, Stack, Text, Box, Avatar } from "@sanity/ui";
import styles from "./TwitterCard.module.css";

export function TwitterCard() {
	// Fake data for preview
	const meta = {
		title: "Why Static Site Generators Rock",
		description:
			"Exploring the benefits of JAMstack and modern web development with static content. Fast, secure, and scalable.",
		image: "https://placehold.co/800x418",
		site: "mywebsite.com",
		username: "@yoursite",
	};
	return (
		<Card className={styles.twitterCard} radius={2} shadow={1} tone="default">
			<Box padding={3} className={styles.userRow}>
				<Avatar src="https://placehold.co/40x40" size={1} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{meta.site}
					</Text>
					<Text size={1} muted>
						{meta.username}
					</Text>
				</Stack>
			</Box>
			<Box>
				<img
					className={styles.imageLarge}
					src={meta.image}
					alt="Twitter preview"
				/>
			</Box>
			<Box padding={3}>
				<Stack space={2}>
					<Text weight="semibold" size={3}>
						{meta.title}
					</Text>
					<Text size={2}>{meta.description}</Text>
				</Stack>
			</Box>
		</Card>
	);
}

export default TwitterCard;
