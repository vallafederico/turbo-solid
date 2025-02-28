import "./app.css";
import { Link, MetaProvider, Title } from "@solidjs/meta";
import { Router, useBeforeLeave } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { getRequestEvent } from "solid-js/web";

import { Suspense } from "solid-js";
import { useViewport } from "~/lib/hooks/useViewport";

import { Nav } from "~/components/Nav";
import Grid from "~/components/Grid";

import Canvas from "~/components/Canvas";

export default function App() {
  useViewport();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Link rel="robots" href="/robots" />

          <Nav />
          <Grid />

          <main data-scroll>
            <Suspense>
              <GlobalLayout>{props.children}</GlobalLayout>
            </Suspense>
          </main>
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

// ////////////////

const GlobalLayout = ({ children, ...props }: { children: any }) => {
  // useBeforeLeave(({ from, to }) => {
  //   console.log(from.pathname, to);
  // });

  return <>{children}</>;
};
