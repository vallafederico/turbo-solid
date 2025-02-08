import { Title } from "@solidjs/meta";

import Section from "~/components/Section";
import { Show, Suspense } from "solid-js";

import { setLocationCallback } from "~/hooks/useLocationCallback";
import { animateAlpha } from "~/animation/alpha.js";

import { createAsync, query, type RouteSectionProps } from "@solidjs/router";
import { createEffect } from "solid-js";

// (*) how does this work?
// https://github.com/solidjs/solid-start/blob/179500ffd6855f7248de7aa6f3672dc2bac773f2/examples/hackernews/src/routes/stories/%5Bid%5D.tsx

async function wait(time = 1): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000 * time);
  });
}

const getContent = query(async () => {
  "use server";

  console.log("loading...");
  await Promise.all([wait(1.2), wait(0.5)]);

  return {
    hello: "world",
    title: "Data Loading Dynamic",
    more: {
      data: "here",
    },
  };
}, "loadeddata");

export const route = {
  preload: () => getContent(),
};

export default function Data(props: RouteSectionProps) {
  setLocationCallback();

  return (
    <main class="min-h-[100vh] pt-20">
      {/* <Title>{loadeddata()?.title}</Title> */}

      <div class="px-gx flex flex-col gap-[2rem]">
        <ShowQuery query={getContent}>
          {(data) => {
            console.log("data:show", data, performance.now());
            return (
              <>
                <h2>Show</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <div>{data.more.data}</div>
              </>
            );
          }}
        </ShowQuery>

        <SuspenseQuery query={getContent}>
          {(data) => {
            console.log("data:suspense", data, performance.now());
            return (
              <>
                <h2>Suspense</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                {/* (MINIMAL ~ 50ms) performance gain with horrible tradeoff */}
                <div>{data?.more?.data}</div>
              </>
            );
          }}
        </SuspenseQuery>
      </div>
      <div class="px-gx"></div>
    </main>
  );
}

// with suspense
const SuspenseQuery = ({
  query,
  children,
}: {
  query: () => Promise<any>;
  children: (data: any) => any;
}) => {
  const data = createAsync(() => query());
  return <Suspense>{children(data())}</Suspense>;
};

// with show
const ShowQuery = ({
  query,
  children,
}: {
  query: () => Promise<any>;
  children: (data: any) => any;
}) => {
  const data = createAsync(() => query());
  return <Show when={data()}>{children(data())}</Show>;
};
