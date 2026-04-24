import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import Track from "~/components/animation/Track";

import { animateAlpha } from "~/animation/alpha";
import { A } from "@solidjs/router";

export default function TrackPage() {
  return (
    <div class="min-h-[100vh] py-20">
      <Title>Track</Title>

      <Section class="px-gx">
        <A href="/_/animation">Back</A>
      </Section>

      <div
        use:animateAlpha
        class="py-20 overflow-clip flex-center max-w-screen"
      >
        <Section class="w-full py-[100vh]">
          <Track class="">hello</Track>
        </Section>
      </div>
    </div>
  );
}
