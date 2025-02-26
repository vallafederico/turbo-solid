import Aa from "./Aa";
import { For } from "solid-js";

// import SocialSprite from "~/components/svg/socialSprite.svg?component-solid";
import { RollingText } from "./animation/RollingText";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  // {
  //   to: "/",
  //   text: "Index",
  // },
  {
    to: "/about",
    text: "About",
  },
  {
    to: "/animation",
    text: "Animation",
  },
  {
    to: "/components",
    text: "Components",
  },
  {
    to: "/webgl",
    text: "WebGl",
  },
  {
    to: "/data-loading",
    text: "Data",
  },
  // {
  //   to: "/protected",
  //   text: "Protected",
  // },
];

export const Nav = () => {
  return (
    <nav class="px-gx fixed top-0 left-0 z-100 flex w-screen items-center justify-between py-6">
      <Aa to="/">
        <p>LOGO</p>
      </Aa>

      {/* desktop menu */}
      <ul class="hidden justify-between md:flex">
        <For each={NAV_LINKS}>
          {({ to, text }) => (
            <li>
              <Aa to={to}>
                <RollingText class="px-3">{text}</RollingText>
              </Aa>
            </li>
          )}
        </For>
      </ul>

      {/* mobile menu */}
      <MobileMenu>
        <ul>
          <For each={NAV_LINKS}>{({ to, text }) => <li>{text}</li>}</For>
        </ul>
      </MobileMenu>
    </nav>
  );
};
