import { Stack, Tab, TabList } from "@sanity/ui";
import { useCallback } from "react";
import { MdImage, MdPlayCircle } from "react-icons/md";
import { MemberField, set } from "sanity";
import styles from "./mediaSelector.module.css";

export default function MediaSelector(props) {
	const {
		elementProps: { id, onBlur, onFocus, placeholder, readOnly, ref },
		onChange,
		renderField,
		renderInput,
		members,
		renderItem,
		renderPreview,
		value,
	} = props;

	const val = value?.mediaType?.toLowerCase?.() || "image";

	const handleTypeSelect = useCallback(
		(mediaType: "image" | "video") => {
			onChange(set({ ...props.value, mediaType }));
		},
		[onChange, props.value],
	);

	const options = [
		{ name: "Image", icon: MdImage },
		{ name: "Video", icon: MdPlayCircle },
	];

	const imageMember = members.find((member: any) => member.name === "image");
	const videoMember = members.find((member: any) => member.name === "video");

	console.log(val);

	return (
		<Stack className={styles.stuff} space={3}>
			<TabList space={2}>
				{options.map((option) => (
					<Tab
						id={`${option.name.toLowerCase()}-tab`}
						aria-controls={`${option.name.toLowerCase()}-panel`}
						key={option.name}
						onClick={() =>
							handleTypeSelect(option.name.toLowerCase() as "image" | "video")
						}
						icon={option.icon}
						label={option.name}
						selected={val === option.name.toLowerCase()}
					/>
				))}
			</TabList>
			<div>
				{val === "image" && (
					<MemberField
						renderInput={renderInput}
						renderField={renderField}
						renderItem={renderItem}
						renderPreview={renderPreview}
						member={imageMember}
					/>
				)}
				{val === "video" && (
					<MemberField
						renderInput={renderInput}
						renderField={renderField}
						renderItem={renderItem}
						renderPreview={renderPreview}
						member={videoMember}
					/>
				)}
			</div>
		</Stack>
	);
}
