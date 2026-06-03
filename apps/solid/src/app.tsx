import "./app.css";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import {
  Router,
  useLayoutTransition,
  type TransitionContextValue,
} from "@acme/router";
import { FileRoutes } from "@solidjs/start/router";

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

const SCROLL_OFFSET = -48;
const FADE_DURATION = 0.4;

/** Pages demo uses overlap cross-fade — skip global sequential fade there. */
const isPagesDemo = (path: string) => /\/pages(\/|$)/.test(path);

const resetScroll = (ctx: TransitionContextValue) => {
  const hash = ctx.path.includes("#") ? `#${ctx.path.split("#")[1]}` : null;
  if (hash) {
    Scroll.lenis?.scrollTo(hash, { offset: SCROLL_OFFSET });
    return;
  }
  Scroll.lenis?.scrollTo(0, { immediate: true });
};

export default function App() {
  useViewport();

  return (
    <Router
      transition={{ timeoutMs: 8000 }}
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
        </MetaProvider>
      )}
    >
      <Suspense fallback={<div>loading things</div>}>
        <FileRoutes />
      </Suspense>
    </Router>
  );
}

const GlobalLayout = ({ children }: { children: unknown }) => {
  useLayoutTransition({
    onEnter: (ctx) => resetScroll(ctx),
    leave: (ctx, el) => {
      if (isPagesDemo(ctx.path)) return;
      return new Promise((resolve) => {
        gsap.to(el, { opacity: 0, duration: FADE_DURATION, onComplete: resolve });
      });
    },
    enter: (ctx, el) => {
      if (isPagesDemo(ctx.path)) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.set(el, { opacity: 0 });
      return new Promise((resolve) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: FADE_DURATION, onComplete: resolve },
        );
      });
    },
  });

  return <main use:scroll>{children}</main>;
};
