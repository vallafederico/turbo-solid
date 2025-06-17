import { Title } from "@solidjs/meta";

import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha.js";

import { A, createAsync } from "@solidjs/router";
import { Show } from "solid-js";

import { getData } from "./util";

export default function Test() {
  const data = createAsync(async () => await getData());

  return (
    <>
      {/* <Title>Protected: Account</Title> */}
      <Show when={data()}>
        <div class="min-h-[100vh] pt-20">
          <Section class="px-gx">
            <div>baseline test1 route</div>
            <Aa href="/_/protected/test">to 1</Aa>
            <div class="py-2">
              <Aa href="/_/protected/">back</Aa>
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
        <Aa href="/_/protected/test">to 1</Aa>
      </Show>
    </>
  );
}
