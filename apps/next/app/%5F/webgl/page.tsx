import Section from "@/components/Section";

export const metadata = {
  title: "WebGl",
};

export default function WebGl() {
  return (
    <div className="min-h-[100vh] pt-navh">
      {Array.from({ length: 3 }, (_, index) => (
        <Section className="flex-center flex h-screen gap-6 px-gx" key={index}>
          <div className="flex-center aspect-5/7 w-grids-3 border border-gray-800 text-center text-sm opacity-70">
            WebGL placeholder
          </div>
        </Section>
      ))}
    </div>
  );
}
