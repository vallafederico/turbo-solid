import { Title } from "@solidjs/meta";
// import DomGroupElement from "~/gl/domGroup/DomGroupElement";
import { DomQuadElement } from "@local/three";
import Section from "../../../components/Section";

export default function WebGl() {
  return (
    <div class="min-h-screen">
      <Title>Home</Title>

      <Section class="flex-center px-margin-1 flex h-screen gap-6">
        <DomQuadElement />
      </Section>
      <Section class="flex-center px-margin-1 flex h-screen gap-6">
        <DomQuadElement />
      </Section>
      <Section class="flex-center px-margin-1 flex h-screen gap-6">
        <DomQuadElement />
      </Section>
    </div>
  );
}
