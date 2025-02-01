import { Title } from "@solidjs/meta";
import { animateAlpha } from "~/animation/alpha";
import Section from "~/components/Section";
import Slider from "@components/animation/Slider";
import { setLocationCallback } from "~/hooks/useLocationCallback";

export default function About() {
  setLocationCallback();

  return (
    <main class="min-h-[100vh] py-20">
      <Title>About</Title>

      <Section class="px-gx">
        <h1 use:animateAlpha>About</h1>

        <div class="flex-center h-[50vh] w-full"></div>
      </Section>
    </main>
  );
}
