import { Card, type CardTone, Flex, Text } from "@sanity/ui";
import type { IconType } from "react-icons/lib";

export default function CardWithIcon({
	icon,
	text,
	tone = "nuetral",
}: { icon: IconType; text: string; tone?: CardTone }) {
	const Icon = icon;

	return (
		<Card marginBottom={3} tone={tone} padding={3}>
			<Flex gap={2} align="center">
				{Icon && <Icon size={18} />}
				<Text size={1}>{text}</Text>
			</Flex>
		</Card>
	);
}
