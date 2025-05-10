import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha";

export default function Animation() {
  return (
    <div class="min-h-[100vh] py-20">
      <Title>About</Title>
      <Section class="">
        <div use:animateAlpha class="px-gx flex flex-col items-start gap-4">
          <h2>Animation</h2>
          <ul class="mt-6 flex flex-col items-start gap-3">
            <li>
              <Aa animate-hover="underline" to="/_/animation/slider">
                Slider
              </Aa>
            </li>
            <li>
              <Aa animate-hover="underline" to="/_/animation/track">
                Track
              </Aa>
            </li>
            <li>
              <Aa animate-hover="underline" to="/_/animation/split-text">
                Split Text
              </Aa>
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
