import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import { animateAlpha } from "~/animation/alpha.js";

import { createSignal, Show, onMount } from "solid-js";

const AppearingComponent = () => {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 1000);
  });

  return (
    <Show when={isVisible()}>
      <div class="h-[200svh] outline">lololo</div>
    </Show>
  );
};

export default function Home() {
  return (
    <div class="min-h-[100vh] pt-20">
      <Title>Home</Title>
      <Section class="px-gx h-[50vh]">
        <h1 use:animateAlpha>Home</h1>
      </Section>
      <AppearingComponent />
      <div class="h-[100svh] bg-blue-500"></div>
      <div class="h-[100svh] bg-red-500"></div>
    </div>
  );
}
