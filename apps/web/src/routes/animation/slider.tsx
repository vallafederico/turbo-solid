import { Title } from "@solidjs/meta";
import Slider from "~/components/animation/Slider";
import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha";

import { setLocationCallback } from "~/hooks/useLocationCallback";

export default function SliderPage() {
  setLocationCallback();

  return (
    <main class="min-h-[100vh] py-20">
      <Title>About</Title>

      <Section class="px-gx">
        <Aa to="/animation">Back</Aa>
      </Section>

      <div
        use:animateAlpha
        class="flex-center max-w-screen overflow-clip py-20"
      >
        <Slider class="h-[70vh]" />
      </div>
    </main>
  );
}
