import Section from "~/components/Section";
import { animateAlpha } from "~/animation/alpha";

export default function GridExample() {
  return (
    <Section class="px-gx flex h-[80svh] w-full flex-col gap-2">
      <h1 class="flex-center" use:animateAlpha>
        Grid system
      </h1>
      <p use:animateAlpha class="text-center">
        use Shift+G to toggle grid view
      </p>

      <div
        use:animateAlpha
        class="flex flex-col gap-2 [&_div]:border [&_div]:border-gray-800"
      >
        <div class="md:w-grids-1 w-grids-1 md:ml-grid-1">
          <h2>One</h2>
        </div>
        <div class="md:w-grids-2 w-grids-2 md:ml-grid-2">
          <h2>Two</h2>
        </div>
        <div class="md:w-grids-3 w-grids-3 md:ml-grid-3">
          <h2>Three</h2>
        </div>
        <div class="md:w-grids-4 w-grids-4 md:ml-grid-4">
          <h2>Four</h2>
        </div>
        <div class="md:w-grids-5 w-grids-5 md:ml-grid-5">
          <h2>Five</h2>
        </div>
        <div class="md:w-grids-6 md:ml-grid-6">
          <h2>Six</h2>
        </div>
        <div class="md:w-grids-7 md:ml-grid-5">
          <h2>Seven</h2>
        </div>
        <div class="md:w-grids-8 md:ml-grid-4">
          <h2>Eight</h2>
        </div>
        <div class="md:w-grids-9 md:ml-grid-3">
          <h2>Nine</h2>
        </div>
        <div class="md:w-grids-10 md:ml-grid-2">
          <h2>Ten</h2>
        </div>
        <div class="md:w-grids-11 md:ml-grid-1">
          <h2>Eleven</h2>
        </div>
        <div class="md:w-grids-12">
          <h2>Twelve</h2>
        </div>
      </div>
    </Section>
  );
}
