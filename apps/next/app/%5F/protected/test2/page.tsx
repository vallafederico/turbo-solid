import Section from "@/components/Section";
import TransitionLink from "@/components/TransitionLink";

import { getProtectedData } from "../data";

export const metadata = {
  title: "Protected: Account",
};

export default async function Test2() {
  const data = await getProtectedData();

  return (
    <div className="min-h-[100vh] pt-navh">
      <Section className="px-gx">
        <div>baseline test1 route</div>
        <TransitionLink animate-hover="underline" href="/_/protected/test">
          to 1
        </TransitionLink>
        <div className="py-2">
          <TransitionLink animate-hover="underline" href="/_/protected">
            back
          </TransitionLink>
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
