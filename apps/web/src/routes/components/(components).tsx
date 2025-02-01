import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha";

import { setLocationCallback } from "~/hooks/useLocationCallback";

export default function Components() {
  setLocationCallback();

  return (
    <main class="min-h-[100vh] py-20">
      <Title>Components</Title>
      <Section class="">
        <div use:animateAlpha class="flex flex-col items-start gap-4 px-gx">
          <h2>Components </h2>
          <ul class="mt-6 flex flex-col items-start gap-3">
            <li>
              <Aa animate-hover="underline" to="/components/dropdown">
                Dropdown
              </Aa>
            </li>
          </ul>
        </div>
      </Section>
    </main>
  );
}
