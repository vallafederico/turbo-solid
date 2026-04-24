import Link from "next/link";

import Section from "@/components/Section";

export const metadata = {
  title: "Track",
};

export default function TrackPage() {
  return (
    <div className="min-h-[100vh] py-20 pt-navh">
      <Section className="px-gx">
        <Link animate-hover="underline" href="/_/animation">
          Back
        </Link>
      </Section>
      <div className="flex-center max-w-screen overflow-clip py-20">
        <Section className="w-full py-[100vh]">
          <div className="mx-auto w-fit rounded-md border border-gray-800 p-6">
            hello
          </div>
        </Section>
      </div>
    </div>
  );
}
