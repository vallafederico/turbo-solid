import Dropdown from "@/components/Dropdown";
import Section from "@/components/Section";
import TransitionLink from "@/components/TransitionLink";

export const metadata = {
  title: "Dropdown",
};

export default function DropdownPage() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <TransitionLink animate-hover="underline" href="/_/components">
          Back
        </TransitionLink>
      </Section>
      <div className="flex-center max-w-screen py-20">
        <Dropdown />
      </div>
    </div>
  );
}
