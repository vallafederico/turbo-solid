import { Box, Button, Flex, Text, useToast } from "@sanity/ui";
import { set } from "sanity";

export default function ButtonSelector(props) {
	const toast = useToast();

	const {
		elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref, value },
		onChange,
		schemaType,
		validation,
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
			<Flex gap={3}>
				{options.map((option, index) => {
					const { title, value, icon, color } = option;
					const isMulticolor = color && color.includes(",");

					const Icon = icon;
					return (
						<Button
							paddingX={3}
							paddingY={2}
							mode={c(props?.value) === c(value) ? "default" : "ghost"}
							onClick={() => handleChange(value)}
							key={index}
						>
							<Flex gap={2} align="center">
								{icon && <Icon size={20} />}
								{color && !isMulticolor && (
									<div
										style={{
											background: color,
											width: "12px",
											height: "12px",
											border: ".2px solid var(--card-fg-color)",
											borderRadius: "100px",
										}}
									></div>
								)}
								<Text size={1} weight="semibold">
									{title}
								</Text>
							</Flex>
						</Button>
					);
				})}
			</Flex>
		</Box>
	);
}
