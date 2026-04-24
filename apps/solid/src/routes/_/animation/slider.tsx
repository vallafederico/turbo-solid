import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import { A } from "@solidjs/router";
import { For } from "solid-js";

import { animateAlpha } from "~/animation/alpha";
import { useSmooothy } from "~/lib/hooks/useSmooothy";

export default function SliderPage() {
  const { ref, slider } = useSmooothy();

  return (
    <div class="min-h-[100vh] py-20">
      <Title>About</Title>

      <Section class="px-gx">
        <A href="/_/animation">Back</A>
      </Section>

      <div
        use:animateAlpha
        class="flex-center max-w-screen overflow-clip py-20"
      >
        <div
          ref={ref}
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
        </div>
      </div>
    </div>
  );
}
