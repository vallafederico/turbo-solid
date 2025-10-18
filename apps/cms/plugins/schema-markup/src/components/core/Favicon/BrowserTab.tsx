import { Box, Flex, Text, useRootTheme } from "@sanity/ui";
import styles from "./favicon-preview.module.css";

export default function BrowserTab({
	url = "https://example.com",
	favicon = "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
	title = "Facebook",
}: { url?: string | null; favicon?: string | null; title?: string | null }) {
	const theme = useRootTheme();

	return (
		<Flex
			gap={2}
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
				border: "var(--tab-border)",
				borderBottom: "none",
			}}
		>
			<img
				src={favicon}
				width={16}
				height={16}
				alt="Favicon on tab"
				style={{
					borderRadius: 4,
					background: "var(--tab-favicon-bg)",
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
						textOverflow: "ellipsis",
						userSelect: "none",
						fontFamily: "inherit",
					}}
				>
					{title}
				</Text>
			</Flex>
		</Flex>
	);
}
