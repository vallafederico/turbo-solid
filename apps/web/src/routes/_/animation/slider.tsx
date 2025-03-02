import { Title } from "@solidjs/meta";
import Slider from "~/components/animation/Slider";
import Section from "~/components/Section";
import Aa from "~/components/Aa";
import { For } from "solid-js";

import { animateAlpha } from "~/animation/alpha";

export default function SliderPage() {
  return (
    <div class="min-h-[100vh] py-20">
      <Title>About</Title>

      <Section class="px-gx">
        <Aa to="/animation">Back</Aa>
      </Section>

      <div
        use:animateAlpha
        class="flex-center max-w-screen overflow-clip py-20"
      >
        <Slider
          style="--slide: 35vw"
          class="flex h-[70vh] w-full pl-[calc(50vw-calc(var(--slide)/2))]"
        >
          <For each={Array.from({ length: 10 }, (v, i) => i)}>
            {(item) => (
              <div class="w-[var(--slide)] shrink-0 p-2">
                <div class="flex-center size-full outline outline-gray-700">
                  {item}
                </div>
              </div>
            )}
          </For>
        </Slider>
      </div>
    </div>
  );
}
