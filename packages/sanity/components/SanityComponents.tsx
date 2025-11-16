import type { Component, JSX } from "solid-js";
import { Dynamic, For } from "solid-js/web";

type ComponentList = {
	[key: string]: Component<any>;
};

export default function SanityComponents({
	components,
	componentList,
}: {
	components: any[];
	componentList: ComponentList;
}) {
	return (
		<For each={components}>
			{(component) => {
				if (!componentList[component._type]) {
					console.warn(`Component of type ${component._type} not found`);
					return null;
				}
				return (
					<Dynamic component={componentList[component._type]} {...component} />
				);
			}}
		</For>
	);
}
