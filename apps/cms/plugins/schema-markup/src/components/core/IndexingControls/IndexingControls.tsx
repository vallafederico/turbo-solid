import type { ObjectInputProps } from "sanity";
import { set } from "sanity";
import { Button, Flex, Text, Card, Box, Stack } from "@sanity/ui";
import { useCallback } from "react";
import CardWithIcon from "../../partials/CardWithIcon";
import { MdInfo, MdPlaylistRemove } from "react-icons/md";
import { IoArrowRedo } from "react-icons/io5";

// Helper to extract and set nested field values
function getNested(obj: Record<string, any>, key: string) {
	return obj && Object.prototype.hasOwnProperty.call(obj, key)
		? obj[key]
		: undefined;
}

export default function IndexingControls(props: ObjectInputProps) {
	const { value = {}, onChange } = props;

	const noFollow = !!getNested(value, "noFollow");
	const noIndex = !!getNested(value, "noIndex");

	const setValue = useCallback(
		(key: "noFollow" | "noIndex", val: boolean) => {
			onChange?.(set(val, [key]));
		},
		[onChange],
	);

	let note = "";
	if (!noIndex && !noFollow) {
		note =
			"This page will be indexed by search engines, and links on this page will be crawled and considered for ranking.";
	} else if (!noIndex && noFollow) {
		note =
			"This page will be indexed by search engines, but links on this page will not be crawled or considered for ranking.";
	} else if (noIndex && !noFollow) {
		note =
			"This page will not be indexed by search engines, but links on this page will be crawled and considered for ranking.";
	} else if (noIndex && noFollow) {
		note =
			"This page will not be indexed by search engines, and links on this page will not be crawled or considered for ranking.";
	}

	return (
		<Stack space={3}>
			<CardWithIcon
				icon={MdInfo}
				tone={noIndex && noFollow ? "critical" : "suggest"}
				text={note}
			/>
			<Flex gap={3}>
				<Button
					width="fill"
					icon={IoArrowRedo}
					mode={noFollow ? "default" : "ghost"}
					selected={noFollow}
					text="No Follow"
					tone={noFollow ? "critical" : "default"}
					onClick={() => setValue("noFollow", !noFollow)}
				/>
				<Button
					width="fill"
					icon={MdPlaylistRemove}
					mode={noIndex ? "default" : "ghost"}
					selected={noIndex}
					text="No Index"
					tone={noIndex ? "critical" : "default"}
					onClick={() => setValue("noIndex", !noIndex)}
				/>
			</Flex>
		</Stack>
	);
}
