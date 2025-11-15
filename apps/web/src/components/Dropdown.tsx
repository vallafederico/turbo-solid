import "./Dropdown.css";
import { type Accessor, createEffect, createSignal, For } from "solid-js";

const content = [
	{
		title: "Dropdown 1",
		content: () => (
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur.
			</p>
		),
	},
	{
		title: "Dropdown 2",
		content: () => (
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur.
			</p>
		),
	},
];

const [open, setOpen] = createSignal<false | number>(false);

export default function Dropdown() {
	let previousOpen: number | false = false;
	const checkboxRefs: HTMLInputElement[] = [];

	createEffect(() => {
		const currentOpen = open();

		if (previousOpen !== false && previousOpen !== currentOpen) {
			const checkbox = checkboxRefs[previousOpen];
			if (checkbox) checkbox.checked = false;
		}

		previousOpen = currentOpen;
	});

	return (
		<div class="flex max-w-[40ch] flex-col gap-4">
			<For each={content}>
				{(item, index) => (
					<DropdownItem
						index={index}
						{...item}
						ref={(el) => (checkboxRefs[index()] = el)}
					/>
				)}
			</For>
		</div>
	);
}

function DropdownItem({
	title,
	content,
	index,
	ref,
}: {
	title: string;
	content: () => any;
	index: Accessor<number>;
	ref: (el: HTMLInputElement) => void;
}) {
	return (
		<div data-dropdown="wrapper" class="rounded-md border border-gray-800">
			{/* head */}
			<div class="relative flex items-center justify-between p-3">
				<p>{title}</p>
				<div
					data-dropdown="icon"
					class="flex aspect-square size-6 items-center justify-center"
				>
					<p>+</p>
				</div>

				<input
					type="checkbox"
					class=""
					ref={ref}
					onInput={(e) => {
						if (open() === index()) {
							setOpen(false);
						} else {
							setOpen(index());
						}
					}}
				/>
			</div>

			{/* content */}
			<div data-dropdown="content">
				<div>
					<div class="p-3">{content()}</div>
				</div>
			</div>
		</div>
	);
}
