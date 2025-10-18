import type { LayoutProps } from "sanity";
import { SeoDefaultsProvider } from "../../context/SeoDefaultsContext";

export default function SeoLayoutWrapper(props: LayoutProps) {
	return (
		<SeoDefaultsProvider>{props.renderDefault(props)}</SeoDefaultsProvider>
	);
}
