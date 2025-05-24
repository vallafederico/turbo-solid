import { Title } from "@solidjs/meta";

import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { createAsync } from "@solidjs/router";
import { createEffect, Show } from "solid-js";

import { getData } from "./test";

export default function Test2() {
  const data = createAsync(async () => await getData());

  createEffect(() => {
    console.log("2", data());
  });

  return (
    <>
      <Show when={data()}>
        <Title>Protected: {data()?.hello}</Title>
        <div class="min-h-[100vh] pt-20">
          <Section class="px-gx">
            <div>test2 route</div>
            <div>{data().hello}</div>
            <Aa href="/protected/test"> to 1</Aa>

            <div class="py-2">
              <Aa href="/protected/">back</Aa>
            </div>
          </Section>
        </div>
      </Show>
    </>
  );
}
