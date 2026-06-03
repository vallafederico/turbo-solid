import "./app.css";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import {
  Router,
  useLayoutTransition,
  type TransitionContextValue,
} from "@acme/router";
import { clientOnly } from "@solidjs/start";
import { FileRoutes } from "@solidjs/start/router";

import { Suspense, type JSX } from "solid-js";
import { useViewport } from "~/lib/hooks/useViewport";

import { Nav } from "~/components/Nav";
import Grid from "~/components/Grid";

import gsap from "~/lib/gsap";
import { Gui } from "~/lib/utils/gui";
import { lerp } from "~/lib/utils/math";
import { Scroll } from "~/lib/utils/scroll";
import { Resizer } from "~/lib/utils/resizer";
import { setWebgl } from "~/lib/stores/webglStore";
import { clientRectGl } from "~/lib/utils/clientRect";
import { assets } from "~/assets";
import { scroll } from "~/lib/utils/scroll";

const ClientCanvas = clientOnly(() =>
  import("@local/three/solid").then((m) => ({ default: m.Canvas })),
);

const FADE_DURATION = 0.4;

const resetScroll = (_ctx: TransitionContextValue) => {
  Scroll.lenis?.scrollTo(0, { immediate: true });
};

export default function App() {
  useViewport();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Link
            rel="robots"
            type="text/plain"
            href="/api/robots.txt"
          />

          <Nav />
          <Grid />

          <Suspense>
            <GlobalLayout>{props.children}</GlobalLayout>
          </Suspense>

          <ClientCanvas
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
        </MetaProvider>
      )}
    >
      <Suspense fallback={<div>loading things</div>}>
        <FileRoutes />
      </Suspense>
    </Router>
  );
}

const GlobalLayout = ({
  children,
}: {
  children: JSX.Element;
}) => {
  useLayoutTransition({
    onEnter: (ctx) => resetScroll(ctx),
    leave: (_ctx, el) =>
      new Promise((resolve) => {
        gsap.to(el, {
          opacity: 0,
          duration: FADE_DURATION,
          onComplete: resolve,
        });
      }),
    enter: (_ctx, el) => {
      gsap.set(el, { opacity: 0 });
      return new Promise((resolve) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: FADE_DURATION,
            onComplete: resolve,
          },
        );
      });
    },
  });

  return <main use:scroll>{children}</main>;
};
