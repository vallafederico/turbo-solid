import { Box, Flex, Text, useRootTheme } from "@sanity/ui";
import styles from "./favicon-preview.module.css";

export default function BrowserTab({
	url = "https://example.com",
	favicon = "https://placehold.co/32x32",
	title = "Facebook",
}: { url: string; favicon: string; title: string }) {
	const theme = useRootTheme();

	return (
		<Box
			data-theme={theme.scheme}
			className={styles.card}
			style={{
				borderRadius: "10px 10px 0 0",
				background: "var(--tab-bg)",
				boxShadow: "var(--tab-shadow)",
				maxWidth: 220,
				minWidth: 140,
				height: 36,
				display: "flex",
				alignItems: "center",
				padding: "0 16px",
				gap: 10,
				border: "var(--tab-border)",
				borderBottom: "none",
			}}
		>
			<img
				src={favicon}
				width={18}
				height={18}
				alt="Favicon on tab"
				style={{
					borderRadius: 4,
					background: "var(--tab-favicon-bg)",
					// border: "var(--tab-favicon-border)",
					marginRight: 6,
					display: "block",
				}}
			/>
			<Flex direction="column" justify="center" align="center">
				<Text
					size={1}
					style={{
						fontWeight: 500,
						color: "var(--tab-url-text-color)",
						opacity: 0.93,
						height: "100%",
						whiteSpace: "nowrap",
						// overflow: "hidden",
						textOverflow: "ellipsis",
						userSelect: "none",
						fontFamily: "inherit",
					}}
				>
					{title}
				</Text>
			</Flex>
		</Box>
	);
}
