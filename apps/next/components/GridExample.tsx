import Section from "@/components/Section";

export default function GridExample() {
  return (
    <Section className="flex h-[80svh] w-full flex-col gap-2 px-gx">
      <h1 className="flex-center">Grid system</h1>
      <p className="text-center">use Shift+G to toggle grid view</p>

      <div className="flex flex-col gap-2 [&_div]:outline [&_div]:outline-gray-800">
        <div className="flex flex-wrap gap-gutter py-20">
          <div className="w-grids-1">1</div>
          <div className="w-grids-2">2</div>
          <div className="w-grids-3">3</div>
          <div className="w-grids-4">4</div>
          <div className="w-grids-5">5</div>
          <div className="w-grids-6">6</div>
          <div className="w-grids-7">7</div>
          <div className="w-grids-8">8</div>
          <div className="w-grids-9">9</div>
        </div>
      </div>
    </Section>
  );
}
