import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { animateAlpha } from "~/animation/alpha.js";

import { useNavigate } from "@solidjs/router";

// (*) [REFACTOR] with vinxxi sessions

import {
  parseCookiesClient,
  removeCookieClient,
  setCookieClient,
} from "~/lib/utils/cookies";

export default function Protected() {
  const navigate = useNavigate();

  const logIn = () => {
    setCookieClient("auth", "true");
    console.log("login:", parseCookiesClient());

    navigate("/_/protected/test2");
  };

  const logOut = () => {
    removeCookieClient("auth");
    console.log("logout:", parseCookiesClient());
  };

  return (
    <div class="min-h-[100vh] pt-20">
      <Section class="px-gx">
        <div>Protected</div>

        <div class="flex gap-2 py-3">
          <button onClick={logIn}>logIn</button>

          <button onClick={logOut}>logOut</button>
        </div>

        <Aa href="/_/protected/test2">To protected Page</Aa>
      </Section>
    </div>
  );
}
