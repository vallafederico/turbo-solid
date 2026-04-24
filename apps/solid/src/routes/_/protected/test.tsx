import { Title } from "@solidjs/meta";

import Section from "~/components/Section";

import { animateAlpha } from "~/animation/alpha.js";

import { A, createAsync } from "@solidjs/router";
import { createEffect, Show } from "solid-js";

import { getData } from "./util";

export default function Test() {
  const data = createAsync(async () => await getData());

  return (
    <>
      {/* <Title>Protected: Account {data && data() && data().hello}</Title> */}
      <Show when={data()}>
        <div class="min-h-[100vh] pt-20">
          <Section class="px-gx">
            <div>baseline test1 route</div>
            <A href="/_/protected/test2">to 2</A>
            <div class="py-2">
              <A href="/_/protected/">back</A>
            </div>
          </Section>

          <Section class="mt-8 px-gx">
            <p>DYNAMIC DATA</p>
            <p>{data().name}</p>
            <p>{data().email}</p>
            <p>{data().phone}</p>
            <p>{data().address}</p>
            <p>{data().city}</p>
            <p>{data().state}</p>
            <p>{data().zip}</p>
            <p>{data().country}</p>
            <p>{data().website}</p>
          </Section>
        </div>

        <p>hi1</p>
        <A href="/_/protected/test2">to 2</A>
      </Show>
    </>
  );
}
