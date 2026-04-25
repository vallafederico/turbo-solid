import { DomQuadElement } from "@local/three/react";

import Section from "@/components/Section";

export const metadata = {
  title: "WebGl",
};

export default function WebGl() {
  return (
    <div className="min-h-[100vh]">
      {Array.from({ length: 3 }, (_, index) => (
        <Section
          className="flex-center flex h-screen gap-6 px-gx"
          key={String(index)}
        >
          <DomQuadElement />
        </Section>
      ))}
    </div>
  );
}
