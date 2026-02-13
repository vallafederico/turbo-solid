import { Title } from "@solidjs/meta";
import Section from "../../../components/Section";

import { DomQuadElement } from "@local/three/solid";
// import { DomGroupElement } from "@local/three/solid";

export default function WebGl() {
  return (
    <div class="min-h-[100vh]">
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
    </div>
  );
}
