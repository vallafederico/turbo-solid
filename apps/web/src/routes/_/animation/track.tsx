import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import Aa from "~/components/Aa";
import Track from "~/components/animation/Track";

import { animateAlpha } from "~/animation/alpha";

export default function TrackPage() {
  return (
    <div class="min-h-[100vh] py-20">
      <Title>Track</Title>

      <Section class="px-gx">
        <Aa href="/_/animation">Back</Aa>
      </Section>

      <div
        use:animateAlpha
        class="flex-center max-w-screen overflow-clip py-20"
      >
        <Section class="w-full py-[100vh]">
          <Track class="">hello</Track>
        </Section>
      </div>
    </div>
  );
}
