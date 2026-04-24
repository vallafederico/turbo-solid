import PageList from "@/components/PageList";
import Section from "@/components/Section";

export const metadata = {
  title: "Animation",
};

export default function Animation() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <h2>Animation</h2>
        <PageList
          items={[
            { href: "/_/animation/slider", label: "Slider" },
            { href: "/_/animation/track", label: "Track" },
            { href: "/_/animation/split-text", label: "Split Text" },
          ]}
        />
      </Section>
    </div>
  );
}
