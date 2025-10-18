import { Card, Stack, Text, Box, Avatar } from "@sanity/ui";
import styles from "./FacebookCard.module.css";

export function FacebookCard() {
	// Fake data for preview
	const meta = {
		title: "My Awesome Page",
		description:
			"This is an engaging summary preview of your content for Facebook! Enjoy maximum clickthrough.",
		image: "https://placehold.co/600x315",
		site: "mywebsite.com",
		author: "Your Brand",
	};
	return (
		<Card className={styles.facebookCard} radius={2} shadow={1} tone="default">
			<Box padding={3} className={styles.header}>
				<Avatar src="https://placehold.co/40x40" size={1} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{meta.author}
					</Text>
					<Text size={1} muted>
						{meta.site}
					</Text>
				</Stack>
			</Box>
			<Box>
				<img className={styles.image} src={meta.image} alt="Facebook preview" />
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

export default FacebookCard;
