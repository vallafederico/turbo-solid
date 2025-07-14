import { Title } from "@solidjs/meta";

import Section from "~/components/Section";

import Split from "~/components/animation/Split";

import { animateAlpha } from "~/animation/alpha";
import { A } from "@solidjs/router";

export default function SplitTextPage() {
  return (
    <div class="min-h-[100vh] py-20">
      <Title>Split Text</Title>

      <div use:animateAlpha>
        <Section class="px-gx">
          <A href="/_/animation">Back</A>
        </Section>
      </div>

      <div class="py-20 flex-center max-w-screen">
        <Split class="text-[2rem]">
          <p class="">Split me</p>
        </Split>
      </div>
      <div class="flex-center min-h-[100vh] max-w-screen py-20">
        <Split class="text-[2rem]">
          <p class="">Cool text here</p>
        </Split>
      </div>
      <div class="py-20 flex-center max-w-screen">
        <Split class="text-[2rem]">
          <p class="">Split me PLEASE</p>
        </Split>
      </div>
    </div>
  );
}
