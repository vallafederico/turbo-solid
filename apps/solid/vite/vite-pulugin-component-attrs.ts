export default function componentDataAttr() {
	return {
		name: "vite-plugin-component-data",
		enforce: "pre",
		apply: "serve", // dev only

		async transform(code, id) {
			if (!id.endsWith(".tsx")) return;

			const match = id.match(/\/([^/]+)\.tsx$/);
			const componentName = match?.[1];
			if (!componentName || componentName[0] !== componentName[0].toUpperCase())
				return;

			// naive but fast — inject after first '<'
			const updated = code.replace(
				/return\s*\(\s*<([A-Za-z0-9]+)/,
				`return (<$1 data-component="${componentName}"`,
			);

			return { code: updated, map: null };
		},
	};
}
