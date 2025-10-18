import { ObjectInputProps } from "sanity";

export default function PageSeoInput(props: ObjectInputProps) {
	return <div>{...props.renderDefault(props)}</div>;
}
