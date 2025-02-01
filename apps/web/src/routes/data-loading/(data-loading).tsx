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
  await Promise.all([wait(1.5), wait(0.5)]);

  return {
    hello: "world",
    title: "Data Loading Dynamic",
    more: {
      data: "here",
    },
  };
}, "loadeddata");

export const route = {
  preload: async ({ location, params }: RouteSectionProps) => {
    return await getContent();
  },
};

export default function Data(props: RouteSectionProps) {
  setLocationCallback();

  const loadeddata = createAsync(() => getContent());

  createEffect(() => {
    console.log("data", loadeddata());
  });

  return (
    <main class="min-h-[100vh] pt-20">
      {/* <Suspense> */}
      <Title>{loadeddata()?.title}</Title>
      {/* </Suspense> */}

      <div class="px-gx">
        {/* suspense */}
        <h2 class="py-4">Using Suspense</h2>
        <Suspense fallback={<div>Loading...</div>}>
          <p>{loadeddata()?.hello}</p>
          <pre>{JSON.stringify(loadeddata(), null, 2)}</pre>
        </Suspense>

        {/* show */}
        <h2 class="py-4">Using Show</h2>
        <Show when={loadeddata()} fallback={<div>waiting</div>}>
          {(data) => {
            const { hello, more } = data();
            // console.log(data());

            return (
              <Section class="">
                <div>{hello}</div>
                <pre>{JSON.stringify(loadeddata(), null, 2)}</pre>
              </Section>
            );
          }}
        </Show>
      </div>
    </main>
  );
}

/*

export default function Data() {
  setLocationCallback();

  const loadeddata = createAsync(() => getContent());
  
  createEffect(() => {
    console.log("data", loadeddata());
  });

  return (
    <Show when={loadeddata()}>
      {(data) => {
        const { hello } = data();

        return (
          <main class="min-h-[100vh] pt-20">
            <Title>{hello}</Title>
            <Section class="px-gx">
              <div>The next bit is data</div>
              <div>{hello}</div>
            </Section>
          </main>
        );
      }}
    </Show>
  );
}
  
*/

/*

export default function Data() {
  setLocationCallback();

  return (
    <Data dataFunc={getContent}>
      {({ hello, user, age }) => (
        <main class="min-h-[100vh] pt-20">
          <Title>{hello}</Title>
          <Section class="px-gx">
            <div>The next bit is data</div>
            <div>{hello}</div>
            <div>{user}</div>
            <div>{age}</div>
          </Section>
        </main>
      )}
    </Data>
  );
}

const Data = ({ dataFunc, children }) => {
  const data = createAsync(() => dataFunc());

  return (
    <Show when={data()}>
      {(loadedData) => {
        const props = loadedData();
        return children(props);
      }}
    </Show>
  );
};

*/
