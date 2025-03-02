import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha";

export default function Components() {
  return (
    <div class="min-h-[100vh] py-20">
      <Title>Components</Title>
      <Section class="">
        <div use:animateAlpha class="px-gx flex flex-col items-start gap-4">
          <h2>Components </h2>
          <ul class="mt-6 flex flex-col items-start gap-3">
            <li>
              <Aa animate-hover="underline" to="/_/components/dropdown">
                Dropdown
              </Aa>
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
