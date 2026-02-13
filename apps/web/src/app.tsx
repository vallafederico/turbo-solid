import "./app.css";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
// import { VisualEditing } from "@local/sanity";

import { Suspense } from "solid-js";
import { useViewport } from "~/lib/hooks/useViewport";

import { Nav } from "~/components/Nav";
import Grid from "~/components/Grid";

import { Canvas } from "@local/three/solid";
import gsap from "~/lib/gsap";
import { Gui } from "~/lib/utils/gui";
import { lerp } from "~/lib/utils/math";
import { Scroll } from "~/lib/utils/scroll";
import { Resizer } from "~/lib/utils/resizer";
import { setWebgl } from "~/lib/stores/webglStore";
import { clientRectGl } from "~/lib/utils/clientRect";
import { assets } from "~/assets";
import { scroll } from "~/lib/utils/scroll";

import { usePageTransition } from "./animation";

export default function App() {
	useViewport();

	return (
		<Router
			root={(props) => (
				<MetaProvider>
					{/* <PageTransition> */}
					<Link rel="robots" type="text/plain" href="/api/robots.txt" />

					<Nav />
					<Grid />

					<Suspense>
						<GlobalLayout>{props.children}</GlobalLayout>
					</Suspense>

					<Canvas
						deps={{
							gsap,
							Gui,
							lerp,
							Scroll,
							Resizer,
							setWebgl,
							assets,
							clientRectGl,
						}}
					/>
					{/* </PageTransition> */}
				</MetaProvider>
			)}
		>
			<Suspense fallback={<div>loading things</div>}>
				<FileRoutes />
			</Suspense>
		</Router>
	);
}

// ////////////////

const GlobalLayout = ({ children, ...props }: { children: any }) => {
	usePageTransition();

	return <main use:scroll>{children}</main>;
};
