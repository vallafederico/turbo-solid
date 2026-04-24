import SplitText from "@/components/animation/SplitText";
import Section from "@/components/Section";
import TransitionLink from "@/components/TransitionLink";

export const metadata = {
  title: "Split Text",
};

const lines = ["Split me Gg yl", "Cool text here", "Split me PLEASE"];

export default function SplitTextPage() {
  return (
    <div className="min-h-screen py-20 pt-navh">
      <Section className="px-gx">
        <TransitionLink animate-hover="underline" href="/_/animation">
          Back
        </TransitionLink>
      </Section>
      {lines.map((line, index) => (
        <div
          className={`flex-center max-w-screen py-20 ${
            index === 1 ? "min-h-screen" : ""
          }`}
          key={line}
        >
          <SplitText className="text-[2rem]">
            <p>{line}</p>
          </SplitText>
        </div>
      ))}
    </div>
  );
}
