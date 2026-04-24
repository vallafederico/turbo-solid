import Link from "next/link";

import Dropdown from "@/components/Dropdown";
import Section from "@/components/Section";

export const metadata = {
  title: "Dropdown",
};

export default function DropdownPage() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <Link animate-hover="underline" href="/_/components">
          Back
        </Link>
      </Section>
      <div className="flex-center max-w-screen py-20">
        <Dropdown />
      </div>
    </div>
  );
}
