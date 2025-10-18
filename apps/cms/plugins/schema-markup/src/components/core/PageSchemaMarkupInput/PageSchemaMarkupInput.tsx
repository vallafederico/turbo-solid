import type { ObjectInputProps } from "sanity";

export default function PageSchemaMarkupInput(props: ObjectInputProps) {
	return <div>{props.renderDefault(props)}</div>;
}
