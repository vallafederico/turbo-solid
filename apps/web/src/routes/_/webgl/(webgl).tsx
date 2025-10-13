import { Title } from "@solidjs/meta";
import Section from "../../../components/Section";

// import DomGroupElement from "~/gl/domGroup/DomGroupElement";
import DomQuadElement from "~/gl/domQuad/DomQuadElement";

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
