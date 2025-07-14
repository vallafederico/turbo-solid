import "./app.css";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router, useBeforeLeave } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import { onCleanup, onMount, Suspense } from "solid-js";
import { useViewport } from "~/lib/hooks/useViewport";

import { Nav } from "~/components/Nav";
import Grid from "~/components/Grid";

import Canvas from "~/components/Canvas";
import { scroll } from "~/app/scroll";

import PageTransition from "./animation/PageTransition";

export default function App() {
  useViewport();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <PageTransition>
            <Title>SolidStart - Basic</Title>
            <Link rel="robots" type="text/plain" href="/api/robots.txt" />

            <Nav />
            <Grid />

            <Suspense>
              <GlobalLayout>{props.children}</GlobalLayout>
            </Suspense>

            <Canvas />
          </PageTransition>
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
  // useBeforeLeave(({ from, to }) => {
  //   console.log(from.pathname, to);
  // });

  return <main use:scroll>{children}</main>;
};
