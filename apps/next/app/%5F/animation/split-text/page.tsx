import Section from "@/components/Section";
import TransitionLink from "@/components/TransitionLink";

export const metadata = {
  title: "Split Text",
};

const lines = ["Split me Gg yl", "Cool text here", "Split me PLEASE"];

export default function SplitTextPage() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <TransitionLink animate-hover="underline" href="/_/animation">
          Back
        </TransitionLink>
      </Section>
      {lines.map((line, index) => (
        <div
          className={`flex-center max-w-screen py-20 ${
            index === 1 ? "min-h-[100vh]" : ""
          }`}
          key={line}
        >
          <p className="split-w text-[2rem]">{line}</p>
        </div>
      ))}
    </div>
  );
}
