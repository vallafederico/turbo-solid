import Aa from "./Aa";
import SocialSprite from "~/components/svg/socialSprite.svg?component-solid";
import { RollingText } from "./animation/RollingText";
import { For } from "solid-js";

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
  // {
  //   to: "/data-loading",
  //   text: "Data",
  // },
  // {
  //   to: "/protected",
  //   text: "Protected",
  // },
];

export const Nav = () => {
  return (
    <nav class="fixed left-0 top-0 z-[100] flex w-screen items-center justify-between px-gx py-6">
      <Aa to="/">
        <p>LOGO</p>
      </Aa>

      {/* desktoip menu */}
      <ul class="flex justify-between">
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
    </nav>
  );
};
