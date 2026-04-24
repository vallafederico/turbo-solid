import Link from "next/link";

import ProtectedActions from "@/components/ProtectedActions";
import Section from "@/components/Section";

export const metadata = {
  title: "Protected",
};

export default function Protected() {
  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="px-gx">
        <div>Protected</div>
        <ProtectedActions />
        <Link animate-hover="underline" href="/_/protected/test2">
          To protected Page
        </Link>
      </Section>
    </div>
  );
}
