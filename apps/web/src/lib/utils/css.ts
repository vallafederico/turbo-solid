export function getCssVariable(name: string): string | null {
	if (typeof window === "undefined" || !document.documentElement) return null;
	return getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
}

export function setCssVariable(name: string, value: string): void {
	if (typeof window === "undefined" || !document.documentElement) return;
	document.documentElement.style.setProperty(name, value);
}
