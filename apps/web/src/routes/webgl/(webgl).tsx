import { Title } from "@solidjs/meta";
import Section from "~/components/Section";

import { setLocationCallback } from "~/lib/hooks/useLocationCallback";

import DomGroupElement from "~/app/gl/domGroup/DomGroupElement";
import DomQuadElement from "~/app/gl/domQuad/DomQuadElement";

export default function WebGl() {
  setLocationCallback();

  return (
    <main class="min-h-[100vh]">
      <Title>Home</Title>

      <Section class="flex-center px-gx flex h-screen gap-6">
        <DomQuadElement />
      </Section>
      <Section class="flex-center px-gx flex h-screen gap-6">
        <DomQuadElement />
      </Section>
      <Section class="flex-center px-gx flex h-screen gap-6">
        <DomQuadElement />
      </Section>
    </main>
  );
}
