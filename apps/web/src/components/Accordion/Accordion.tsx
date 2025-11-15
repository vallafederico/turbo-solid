import cx from "classix";
import type { JSXElement } from "solid-js";
import styles from "./accordion.module.css";

interface AccordionProps {
	title: string;
	children: JSXElement;
	name: string;
	class?: string;
	headingClass?: string;
}

export default function Accordion({
	title,
	children,
	name,
	class: className = "",
	headingClass = "",
}: AccordionProps) {
	return (
		<details class={`${styles.accordion} ${className}`} name={name}>
			<summary
				class={cx(
					headingClass,
					"pt-28 pb-30 text-green-30 justify-between pl-32 pr-26 flex items-center gap-15",
				)}
			>
				<div class="subhead-1">{title}</div>
				<div>+</div>
			</summary>
			<div data-accordion="panel">
				<div data-accordion="content">
					<div>{children}</div>
				</div>
			</div>
		</details>
	);
}
