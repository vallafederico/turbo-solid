import { Card, Stack, Text, Box, Avatar } from "@sanity/ui";
import styles from "./FacebookCard.module.css";
import { truncate } from "../../../utils/truncate";

export interface FacebookCardProps {
	title?: string;
	description?: string;
	image?: string;
	site?: string;
	author?: string;
	avatar?: string;
}

export function FacebookCard(props: FacebookCardProps) {
	const fallback = {
		title: "My Awesome Page",
		description:
			"This is an engaging summary preview of your content for Facebook! Enjoy maximum clickthrough.",
		image: "https://placehold.co/600x315",
		site: "mywebsite.com",
		author: "Your Brand",
		avatar: "https://placehold.co/40x40",
	};
	const data = { ...fallback, ...props };

	return (
		<Card className={styles.facebookCard} radius={2} shadow={1} tone="default">
			<Box padding={3} className={styles.header}>
				<Avatar src={data.avatar} size={1} />
				<Stack space={2}>
					<Text weight="semibold" size={2}>
						{data.author}
					</Text>
					<Text size={1} muted>
						{data.site}
					</Text>
				</Stack>
			</Box>
			<Box>
				<img className={styles.image} src={data.image} alt="Facebook preview" />
			</Box>
			<Box padding={3}>
				<Stack space={2}>
					<Text weight="semibold" size={3}>
						{truncate(data.title, 60)}
					</Text>
					<Text size={2}>{truncate(data.description, 110)}</Text>
				</Stack>
			</Box>
		</Card>
	);
}

export default FacebookCard;
