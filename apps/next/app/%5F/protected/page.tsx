import ProtectedActions from "@/components/ProtectedActions";
import Section from "@/components/Section";
import TransitionLink from "@/components/TransitionLink";

export const metadata = {
  title: "Protected",
};

export default function Protected() {
  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="px-gx">
        <div>Protected</div>
        <ProtectedActions />
        <TransitionLink animate-hover="underline" href="/_/protected/test2">
          To protected Page
        </TransitionLink>
      </Section>
    </div>
  );
}
