// import { ErrorBoundary, type JSX, Show } from "solid-js";
// import { HttpStatusCode } from "@solidjs/start";
// import type { Seo } from "../types";
// import { PageMeta } from "@local/solid-components";

// export default function ShopifyPage({
// 	children,
// 	fetcher = () => {},
// 	class: className,
// }: {
// 	children: (data: any) => JSX.Element;
// 	fetcher?: any;
// 	class?: string;
// }) {
// 	return (
// 		<ErrorBoundary fallback={<HttpStatusCode code={404} />}>
// 			<div class={`min-h-screen ${className}`}>
// 				<Show when={fetcher()}>
// 					{(data) => {
// 						const seo = data()?.seo;

// 						const title = seo?.title || data()?.title;
// 						const description = seo?.description || data()?.description;

// 						return (
// 							<>
// 								<PageMeta title={title} description={description} />
// 								{children(data)}
// 							</>
// 						);
// 					}}
// 				</Show>
// 			</div>
// 		</ErrorBoundary>
// 	);
// }
