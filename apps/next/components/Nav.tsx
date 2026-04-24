import Link from "next/link";

import MobileMenu from "@/components/MobileMenu";
import RollingText from "@/components/RollingText";

const NAV_LINKS = [
  {
    href: "/_/about",
    text: "About Us",
  },
  {
    href: "/_/animation",
    text: "Animation",
  },
  {
    href: "/_/components",
    text: "Components",
  },
  {
    href: "/_/webgl",
    text: "WebGl",
  },
  {
    href: "/_/data-loading",
    text: "Data",
  },
  {
    href: "/_/content",
    text: "CMS Content",
  },
];

export default function Nav() {
  return (
    <nav className="pointer-events-none fixed top-0 left-0 z-[100] flex w-screen items-center justify-between px-gx py-6">
      <Link
        aria-label="homepage"
        className="pointer-events-auto z-20"
        href="/"
      >
        <p>LOGO</p>
      </Link>

      <ul className="pointer-events-auto hidden justify-between md:flex">
        {NAV_LINKS.map(({ href, text }) => (
          <li key={href}>
            <Link href={href}>
              <RollingText className="px-3">{text}</RollingText>
            </Link>
          </li>
        ))}
      </ul>

      <MobileMenu>
        <ul className="flex flex-col gap-4">
          {NAV_LINKS.map(({ href, text }) => (
            <li key={href}>
              <Link href={href}>{text}</Link>
            </li>
          ))}
        </ul>
      </MobileMenu>
    </nav>
  );
}
