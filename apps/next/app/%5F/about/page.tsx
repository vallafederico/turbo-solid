import GridExample from "@/components/GridExample";
import Section from "@/components/Section";

export const metadata = {
  title: "About",
};

export default function About() {
  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="px-gx py-20">
        <h1>About</h1>
      </Section>
      <GridExample />
      <Section className="flex-center h-[80svh] w-full px-gx">
        <h1>Two</h1>
      </Section>
      <Section className="flex-center h-[80svh] w-full px-gx">
        <h1>Last</h1>
      </Section>
    </div>
  );
}
