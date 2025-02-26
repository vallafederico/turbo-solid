import { Title } from "@solidjs/meta";
import { setLocationCallback } from "~/lib/hooks/useLocationCallback";

import Section from "~/components/Section";
import Aa from "~/components/Aa";
import Dropdown from "~/components/Dropdown";

import { animateAlpha } from "~/animation/alpha";

export default function SplitTextPage() {
  setLocationCallback();

  return (
    <main class="min-h-[100vh] py-20">
      <Title>Split Text</Title>

      <div use:animateAlpha>
        <Section class="px-gx">
          <Aa to="/components">Back</Aa>
        </Section>
      </div>

      <div class="flex-center max-w-screen py-20">
        <Dropdown />
      </div>
    </main>
  );
}
