import { JSX } from 'solid-js'
import styles from './accordion.module.css'
import cx from 'classix'

interface AccordionProps {
	title: string
	children: JSX.Element
	name: string
	class?: string
	headingClass?: string
}

export default function Accordion({
	title,
	children,
	name,
	class: className = '',
	headingClass: headingClassName = '',
}: AccordionProps) {
	return (
		<details class={`${styles.accordion} ${className}`} name={name}>
			<summary class={cx(headingClassName)}>
				{title} <figure data-accordion="icon">+</figure>
			</summary>
			<div data-accordion="panel">
				<div data-accordion="content">{children}</div>
			</div>
		</details>
	)
}
