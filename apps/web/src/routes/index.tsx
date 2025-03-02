import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import { animateAlpha } from "~/animation/alpha.js";

export default function Home() {
  return (
    <div class="min-h-[100vh] pt-20">
      <Title>Home</Title>
      <Section class="px-gx h-[50vh]">
        <h1 use:animateAlpha>Home</h1>
      </Section>
    </div>
  );
}
