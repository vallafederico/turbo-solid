import { Card, Stack, Text, Box } from "@sanity/ui";
import styles from "./GoogleEntry.module.css";

export function GoogleEntry() {
	// Fake data for preview
	const meta = {
		title: "My Awesome Page - MyWebsite",
		description:
			"A compelling meta description for Google search snippet. Explain what users can find inside!",
		site: "https://mywebsite.com/page",
	};
	return (
		<Card className={styles.googleCard} radius={2} shadow={1} tone="default">
			<Box padding={3}>
				<Stack space={1}>
					<Text size={2} className={styles.site}>
						{meta.site}
					</Text>
					<Text weight="semibold" size={3} className={styles.title}>
						{meta.title}
					</Text>
					<Text size={2} className={styles.desc}>
						{meta.description}
					</Text>
				</Stack>
			</Box>
		</Card>
	);
}

export default GoogleEntry;
