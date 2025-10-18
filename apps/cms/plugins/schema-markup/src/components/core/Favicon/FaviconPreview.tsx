import { Box, Card, Flex, Text, useRootTheme } from "@sanity/ui";
import type { ImageInputProps } from "sanity";
import { useSeoDefaults } from "../../../context/SeoDefaultsContext";
import { useMemo } from "react";
import WindowControls from "./WindowControls";
import BrowserTab from "./BrowserTab";
import styles from "./favicon-preview.module.css";
import { buildSrc } from "@sanity-image/url-builder";
import { useDataset, useProjectId } from "sanity";

export default function FaviconPreview(props: ImageInputProps) {
	const defaults = useSeoDefaults();
	const theme = useRootTheme();
	const dataset = useDataset();
	const projectId = useProjectId();

	const url = useMemo(() => {
		const domain = defaults?.siteUrl ? defaults.siteUrl : "https://example.com";
		return domain.replace("https://", "");
	}, [defaults]);

	const faviconUrl = useMemo(() => {
		return props.value?.asset?._ref
			? buildSrc({
					id: props.value?.asset?._ref,
					baseUrl: `https://cdn.sanity.io/images/${projectId}/${dataset}/`,
				})?.src
			: null;
	}, [props.value?.asset?._ref, projectId, dataset]);

	return (
		<div className={styles.card}>
			<Card
				data-tab-display
				data-theme={theme.scheme}
				shadow={2}
				marginBottom={2}
				radius={4}
				style={{
					width: "100%",
				}}
			>
				<Flex paddingX={4} paddingY={2} justify="start" align="center">
					<WindowControls />
					<BrowserTab
						url={url}
						title={defaults?.siteTitle}
						favicon={faviconUrl}
					/>
					<BrowserTab />
				</Flex>
			</Card>
			<Box className={styles?.["image-preview"]}>
				{props.renderDefault(props)}
			</Box>
		</div>
	);
}
