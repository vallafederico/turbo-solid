import "./app.css";

import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { useViewport } from "~/lib/hooks/useViewport";
// import { Scroll } from "./app/scroll";

import { Nav } from "./components/Nav";
import Grid from "./components/Grid";

import { useLocationCallback } from "~/lib/hooks/useLocationCallback";
import Canvas from "./components/Canvas";

export default function App() {
  useLocationCallback();
  useViewport();

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <Nav />
          <Grid />

          <div data-scroll>
            <Suspense>{props.children}</Suspense>
          </div>
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
