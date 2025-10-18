import { Box, Button, Flex, Grid, Text, useToast } from "@sanity/ui";
import { set } from "sanity";
import ButtonWithIcon from "../../partials/ButtonWithIcon";

export default function ButtonSelector(props) {
	const toast = useToast();

	const {
		elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref, value },
		onChange,
		schemaType,
		validation,
		// value = '',
	} = props;

	const options = schemaType.options.list;

	const handleChange = (option: string) => {
		console.log(option);
		onChange(set(option));
	};

	const c = (c: string) => {
		c = c?.replaceAll("#", "")?.toLowerCase().trim();
		return c;
	};

	return (
		<Box>
			<Grid columns={3} gap={3}>
				{options.map((option, index) => {
					const { title, value, icon, color } = option;

					const Icon = icon;
					return (
						<ButtonWithIcon
							key={value}
							buttonProps={{
								paddingY: 4,
								mode: c(props?.value) === c(value) ? "default" : "ghost",
								onClick: () => handleChange(value),
							}}
							label={title}
							icon={icon}
						/>
					);
				})}
			</Grid>
		</Box>
	);
}
