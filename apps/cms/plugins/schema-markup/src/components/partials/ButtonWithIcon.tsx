import { Button, type ButtonProps, Flex, Text } from "@sanity/ui";
import type { IconType } from "react-icons/lib";

export default function ButtonWithIcon({
	icon,
	buttonProps = {},
	label,
}: { icon: IconType; buttonProps?: ButtonProps; label: string }) {
	const Icon = icon;

	return (
		<Button {...buttonProps}>
			<Flex gap={2} align="center" justify="center">
				{Icon && <Icon size={17} />}

				<Text size={1} weight="semibold">
					{label}
				</Text>
			</Flex>
		</Button>
	);
}
