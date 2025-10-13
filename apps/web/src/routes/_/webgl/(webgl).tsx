import { Title } from "@solidjs/meta";
import Section from "../../../components/Section";

// import DomGroupElement from "~/gl/domGroup/DomGroupElement";
import DomQuadElement from "~/gl/_/domQuad/DomQuadElement";

export default function WebGl() {
  return (
    <div class="min-h-[100vh]">
      <Title>Home</Title>

      <Section class="flex gap-6 h-screen flex-center px-gx">
        <DomQuadElement />
      </Section>
      <Section class="flex gap-6 h-screen flex-center px-gx">
        <DomQuadElement />
      </Section>
      <Section class="flex gap-6 h-screen flex-center px-gx">
        <DomQuadElement />
      </Section>
    </div>
  );
}
