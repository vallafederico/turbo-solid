import PageList from "@/components/PageList";
import Section from "@/components/Section";

export const metadata = {
  title: "Components",
};

export default function Components() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <h2>Components</h2>
        <PageList items={[{ href: "/_/components/dropdown", label: "Dropdown" }]} />
      </Section>
    </div>
  );
}
