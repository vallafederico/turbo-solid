import type { CSSProperties } from "react";
import Link from "next/link";

import Section from "@/components/Section";

export const metadata = {
  title: "Slider",
};

export default function SliderPage() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <Link animate-hover="underline" href="/_/animation">
          Back
        </Link>
      </Section>
      <div className="flex-center max-w-screen overflow-clip py-20">
        <div
          className="flex h-[70vh] w-full overflow-x-auto pl-[calc(50vw-calc(var(--slide)/2))]"
          style={{ "--slide": "35vw" } as CSSProperties}
        >
          {Array.from({ length: 10 }, (_, item) => (
            <div className="w-[var(--slide)] shrink-0 p-2" key={item}>
              <div className="flex-center size-full outline outline-gray-700">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
