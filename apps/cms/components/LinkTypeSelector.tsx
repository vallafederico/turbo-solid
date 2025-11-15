import { Stack, Tab, TabList } from "@sanity/ui";
import { useCallback } from "react";
import { CgExternal } from "react-icons/cg";
import { MdLink } from "react-icons/md";
import { MemberField, set } from "sanity";
// @ts-expect-error
import styles from "./MediaSelector/mediaSelector.module.css";

export default function LinkTypeSelector(props: any) {
	const {
		onChange,
		renderField,
		renderInput,
		members,
		renderItem,
		renderPreview,
		value,
	} = props;

	const val = value?.linkType?.toLowerCase?.() || "internal";

	const handleTypeSelect = useCallback(
		(linkType: "internal" | "external") => {
			onChange(set({ ...props.value, linkType }));
		},
		[onChange, props.value],
	);

	const options = [
		{ name: "Internal Link", value: "internal", icon: MdLink },
		{ name: "External Link", value: "external", icon: CgExternal },
	];

	const internalMembers = members.filter(
		(member: any) => member.name === "page",
	);
	const externalMembers = members.filter(
		(member: any) => member.name === "url",
	);

	return (
		<Stack className={styles.stuff} space={3}>
			<TabList space={2}>
				{options.map((option) => (
					<Tab
						id={`${option.value}-tab`}
						aria-controls={`${option.value}-panel`}
						key={option.name}
						onClick={() =>
							handleTypeSelect(option.value as "internal" | "external")
						}
						icon={option.icon}
						label={option.name}
						selected={val === option.value}
					/>
				))}
			</TabList>
			<div>
				{val === "internal" &&
					internalMembers.map((member: any) => (
						<MemberField
							renderInput={renderInput}
							renderField={renderField}
							renderItem={renderItem}
							renderPreview={renderPreview}
							key={member.name}
							member={member}
						/>
					))}
				{val === "external" &&
					externalMembers.map((member: any) => (
						<MemberField
							renderInput={renderInput}
							renderField={renderField}
							renderItem={renderItem}
							renderPreview={renderPreview}
							key={member.name}
							member={member}
						/>
					))}
			</div>
		</Stack>
	);
}
