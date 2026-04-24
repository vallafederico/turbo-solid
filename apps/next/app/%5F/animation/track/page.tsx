import TrackProgress from "@/components/animation/TrackProgress";
import Section from "@/components/Section";
import TransitionLink from "@/components/TransitionLink";

export const metadata = {
  title: "Track",
};

export default function TrackPage() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <TransitionLink animate-hover="underline" href="/_/animation">
          Back
        </TransitionLink>
      </Section>
      <div className="flex-center max-w-screen overflow-clip py-20">
        <Section className="w-full py-[100vh]">
          <TrackProgress />
        </Section>
      </div>
    </div>
  );
}
