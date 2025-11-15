import Canvas from "~/components/Canvas";
import "./app.css";

import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { isDev } from "solid-js/web";
import GlobalLayout from "~/components/GlobalLayout";
import GridOverlay from "~/components/GridOverlay";
import { useViewport } from "~/lib/hooks/useViewport";

export default function App() {
	useViewport();

	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<meta charset="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0"
					/>

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
