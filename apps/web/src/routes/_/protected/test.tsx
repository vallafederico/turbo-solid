import { Title } from "@solidjs/meta";

import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha.js";

import { createAsync, redirect } from "@solidjs/router";
import { createEffect, Show } from "solid-js";
import { cache } from "@solidjs/router";
import { parseCookies } from "vinxi/http";

async function wait(time = 1): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000 * time);
  });
}

const getData = cache(async () => {
  "use server";

  console.log("...");
  await wait(0.2);
  console.log("done");

  const cookies = parseCookies();
  console.log("cookies", cookies);

  if (!cookies.auth) {
    console.log("no auth, redirecting ...");
    return redirect("/protected/");
  }

  return {
    hello: "hello",
    also: "world",
  };
}, "test");

export default function Test() {
  const data = createAsync(async () => await getData());

  createEffect(() => {
    console.log("1", data());
  });

  return (
    <>
      <Show when={data()}>
        <Title>Protected: {data()?.hello}</Title>
        <div class="min-h-[100vh] pt-20">
          <Section class="px-gx">
            <div>baseline test1 route</div>
            <div>{data().hello}</div>

            <Aa to="/protected/test2">to 2</Aa>
            <div class="py-2">
              <Aa to="/protected/">back</Aa>
            </div>
          </Section>
        </div>
      </Show>
    </>
  );
}

export { getData };
