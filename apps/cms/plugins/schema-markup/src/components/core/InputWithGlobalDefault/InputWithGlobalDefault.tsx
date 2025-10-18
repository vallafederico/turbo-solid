import { Box, Card, Flex, Text } from "@sanity/ui";
import type { InputProps } from "sanity";
import { useSeoDefaults } from "../../../context/SeoDefaultsContext";
import { MdCheck, MdWarning } from "react-icons/md";
import CardWithIcon from "../../partials/CardWithIcon";

export default function InputWithGlobalDefault(props: InputProps) {
	const defaults = useSeoDefaults();

	const defaultFieldName = props?.schemaType?.options?.matchingDefaultField;

	if (!defaultFieldName) {
		console.warn(
			"No default field name found for input: ",
			props?.schemaType?.name,
		);
	}

	const value = props?.value;
	const hasDefault = defaultFieldName ? defaults?.[defaultFieldName] : false;

	return (
		<div>
			{!value && !hasDefault && (
				<CardWithIcon
					icon={MdWarning}
					tone="critical"
					text="This field does not have a global default set. Make sure to fill it in here."
				/>
			)}
			{!value && hasDefault && (
				<CardWithIcon
					icon={MdCheck}
					tone="suggest"
					text="This field is using the global default."
				/>
			)}

			<Box>{props.renderDefault(props)}</Box>
		</div>
	);
}
