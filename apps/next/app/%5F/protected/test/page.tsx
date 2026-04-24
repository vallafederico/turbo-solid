import Link from "next/link";

import Section from "@/components/Section";

import { getProtectedData } from "../data";

export const metadata = {
  title: "Protected: Account",
};

export default async function Test() {
  const data = await getProtectedData();

  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="px-gx">
        <div>baseline test1 route</div>
        <Link animate-hover="underline" href="/_/protected/test2">
          to 2
        </Link>
        <div className="py-2">
          <Link animate-hover="underline" href="/_/protected">
            back
          </Link>
        </div>
      </Section>
      <Section className="mt-8 px-gx">
        <p>DYNAMIC DATA</p>
        {Object.values(data).map((value) => (
          <p key={value}>{value}</p>
        ))}
      </Section>
    </div>
  );
}
