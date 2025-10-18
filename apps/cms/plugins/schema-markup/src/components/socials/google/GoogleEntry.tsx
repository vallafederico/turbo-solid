import { Card, Stack, Text, Box } from "@sanity/ui";
import styles from "./GoogleEntry.module.css";
import { truncate } from "../../../utils/truncate";

export interface GoogleEntryProps {
	title?: string;
	description?: string;
	site?: string;
}

export function GoogleEntry(props: GoogleEntryProps) {
	const fallback = {
		title: "My Awesome Page - MyWebsite",
		description:
			"A compelling meta description for Google search snippet. Explain what users can find inside!",
		site: "https://mywebsite.com/page",
	};

	const data = { ...fallback, ...props };

	return (
		<Card className={styles.googleCard} radius={2} shadow={1} tone="default">
			<Box padding={3}>
				<Stack space={1}>
					<Text size={2} className={styles.site}>
						{data.site}
					</Text>
					<Text weight="semibold" size={3} className={styles.title}>
						{truncate(data.title, 60)}
					</Text>
					<Text size={2} className={styles.desc}>
						{truncate(data.description, 155)}
					</Text>
				</Stack>
			</Box>
		</Card>
	);
}

export default GoogleEntry;
