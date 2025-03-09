import { Title } from "@solidjs/meta";

import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha";
import Accordion from "~/components/Accordion/Accordion";
import { For } from "solid-js";

export default function DropdownPage() {
  
  const content = [
    {
      title: "Dropdown 1",
      text: "Labore id culpa minim labore velit esse et aliqua cillum esse consequat labore eiusmod. Elit sunt nulla velit mollit elit.",
    },
    {
      title: "Dropdown 2",
      text: "Labore id culpa minim labore velit esse et aliqua cillum esse consequat labore eiusmod. Elit sunt nulla velit mollit elit.",
    },
  ];

  return (
    <div class="min-h-[100vh] py-20">
      <Title>Dropdown</Title>

      <div class="w-grids-3 mx-auto flex flex-col items-center gap-2">
        <For each={content}>
          {(item, i) => (
            <Accordion
              headingClass="w-full rounded-md p-3"
              class="w-full rounded-md border border-gray-800"
              title={item.title}
              name="dropdown"
            >
              <p class="p-3">{item.text}</p>
            </Accordion>
          )}
        </For>
      </div>

      <div use:animateAlpha>
        <Section class="px-gx">
          <Aa to="/components">Back</Aa>
        </Section>
      </div>
    </div>
  );
}
