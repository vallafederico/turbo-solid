import Aa from "~/components/Aa";
import { SanityLink, sanityLink } from "@local/sanity";
import { animateAlpha } from "~/animation/alpha";

interface HeaderProps {
  text: string /* autogen */;
  link: any /* autogen */;
}

export default function Header({ text, link }: HeaderProps) {
  return (
    <div
      class="flex h-[60vh] flex-col items-center justify-center border text-center text-3xl"
      use:animateAlpha
    >
      <h2>Header Slice</h2>
      <SanityLink
        class="mt-20 block rounded-2xl border bg-white px-20 py-4 text-black"
        tag={Aa}
        {...link}
      />
    </div>
  );
}
