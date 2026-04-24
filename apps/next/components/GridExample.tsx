import Section from "@/components/Section";

export default function GridExample() {
  return (
    <Section className="flex h-[80svh] w-full flex-col gap-2 px-gx">
      <h1 className="flex-center">Grid system</h1>
      <p className="text-center">use Shift+G to toggle grid view</p>

      <div className="flex flex-col gap-2 [&_div]:border [&_div]:border-gray-800">
        <div className="ml-grid-1 w-grids-1">
          <h2>One</h2>
        </div>
        <div className="w-grids-2 md:ml-grid-2 md:w-grids-2">
          <h2>Two</h2>
        </div>
        <div className="w-grids-3 md:ml-grid-3 md:w-grids-3">
          <h2>Three</h2>
        </div>
        <div className="w-grids-4 md:ml-grid-4 md:w-grids-4">
          <h2>Four</h2>
        </div>
        <div className="w-grids-5 md:ml-grid-5 md:w-grids-5">
          <h2>Five</h2>
        </div>
        <div className="md:ml-grid-6 md:w-grids-6">
          <h2>Six</h2>
        </div>
        <div className="md:ml-grid-5 md:w-grids-7">
          <h2>Seven</h2>
        </div>
        <div className="md:ml-grid-4 md:w-grids-8">
          <h2>Eight</h2>
        </div>
        <div className="md:ml-grid-3 md:w-grids-9">
          <h2>Nine</h2>
        </div>
        <div className="md:ml-grid-2 md:w-grids-10">
          <h2>Ten</h2>
        </div>
        <div className="md:ml-grid-1 md:w-grids-11">
          <h2>Eleven</h2>
        </div>
        <div className="md:w-grids-12">
          <h2>Twelve</h2>
        </div>
      </div>
    </Section>
  );
}
