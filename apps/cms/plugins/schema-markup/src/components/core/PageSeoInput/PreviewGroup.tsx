import { Box, Text } from "@sanity/ui";

export function PreviewGroup({
	title,
	children,
}: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<Box marginBottom={4}>
				<Text weight="semibold" size={2}>
					{title}
				</Text>
			</Box>
			{children}
		</div>
	);
}
