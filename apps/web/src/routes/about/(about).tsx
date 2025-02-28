import { Title } from "@solidjs/meta";
import { animateAlpha } from "~/animation/alpha";
import Section from "~/components/Section";
import GridExample from "~/components/GridExample";

import { useWindowResize } from "~/lib/hooks/useWindowResize";

export default function About() {
  useWindowResize(({ height, width }) => {
    console.log("hello!", height, width);
  });

  return (
    <div class="pt-navh min-h-[100vh]">
      <Title>About</Title>

      <Section class="px-gx py-20">
        <h1>About</h1>
      </Section>

      <GridExample />

      <Section class="flex-center px-gx h-[80svh] w-full">
        <h1 use:animateAlpha>Two</h1>
      </Section>
      <Section class="flex-center px-gx h-[80svh] w-full">
        <h1 use:animateAlpha>Last</h1>
      </Section>
    </div>
  );
}
