import { Title } from "@solidjs/meta";
import { animateAlpha } from "~/animation/alpha";
import Section from "~/components/Section";
import Slider from "@components/animation/Slider";
import { setLocationCallback } from "~/hooks/useLocationCallback";

export default function About() {
  setLocationCallback();

  return (
    <main class="pt-navh min-h-[100vh]">
      <Title>About</Title>

      <Section class="px-gx">
        <h1 use:animateAlpha>About</h1>
      </Section>
      <Section class="flex-center h-[80svh] w-full border px-gx">
        <h1 use:animateAlpha>One</h1>
      </Section>
      <Section class="flex-center h-[80svh] w-full border px-gx">
        <h1 use:animateAlpha>Two</h1>
      </Section>
      <Section class="flex-center h-[80svh] w-full border px-gx">
        <h1 use:animateAlpha>Last</h1>
      </Section>
    </main>
  );
}
