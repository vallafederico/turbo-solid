import Section from "~/components/Section";
import { animateAlpha } from "~/animation/alpha";

export default function GridExample() {
  return (
    <Section
      class="px-gx flex h-[80svh] w-full flex-col gap-2"
    >
      <h1
        class="flex-center"
        use:animateAlpha
      >
        Grid system
      </h1>
      <p
        use:animateAlpha
        class="text-center"
      >
        use Shift+G to toggle grid view
      </p>

      <div
        use:animateAlpha
        class="flex flex-col gap-2 [&_div]:outline
          [&_div]:outline-gray-800"
      >
        <div class="flex flex-wrap py-20 gap-gutter">
          <div class="w-grids-1">1</div>
          <div class="w-grids-2">2</div>
          <div class="w-grids-3">3</div>
          <div class="w-grids-4">4</div>
          <div class="w-grids-5">5</div>
          <div class="w-grids-6">6</div>
          <div class="w-grids-7">7</div>
          <div class="w-grids-8">8</div>
          <div class="w-grids-9">9</div>
        </div>
      </div>
    </Section>
  );
}
