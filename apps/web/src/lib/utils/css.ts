import { isServer } from "solid-js/web";

export function getCssVariable(name: string): string | null {
	if (isServer || !document.documentElement) return null;
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
}

export function setCssVariable(name: string, value: string): void {
	if (isServer || !document.documentElement) return;
	document.documentElement.style.setProperty(name, value);
}
