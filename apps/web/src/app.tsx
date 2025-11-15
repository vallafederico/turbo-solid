import "./app.css";

import GlobalLayout from "@components/GlobalLayout";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { isDev } from "solid-js/web";
import Canvas from "~/components/Canvas";
import GridOverlay from "~/components/GridOverlay";
import { useViewport } from "~/lib/hooks/useViewport";

export default function App() {
	useViewport();

	return (
		<Router
			root={(props) => (
				<MetaProvider>
					{isDev && <GridOverlay />}

					<Suspense>
						<GlobalLayout>{props.children}</GlobalLayout>
					</Suspense>
					<Canvas />
				</MetaProvider>
			)}
		>
			<Suspense fallback={<div>loading things</div>}>
				<FileRoutes />
			</Suspense>
		</Router>
	);
}
