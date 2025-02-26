import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import Section from "~/components/Section";
import Aa from "~/components/Aa";

import { setLocationCallback } from "~/lib/hooks/useLocationCallback";
import { animateAlpha } from "~/animation/alpha.js";
import Track from "@components/animation/Track";
import { createAsync, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import { cache } from "@solidjs/router";
import { setCookie, parseCookies } from "vinxi/http";

// (*) [REFACTOR] with vinxxi sessions

import {
  parseCookiesClient,
  removeCookieClient,
  setCookieClient,
} from "~/lib/utils/cookies";

export default function Protected() {
  setLocationCallback();
  const navigate = useNavigate();

  const logIn = () => {
    setCookieClient("auth", "true");
    console.log("login:", parseCookiesClient());

    navigate("/protected/test2");
  };

  const logOut = () => {
    removeCookieClient("auth");
    console.log("logout:", parseCookiesClient());
  };

  return (
    <main class="min-h-[100vh] pt-20">
      <Section class="px-gx">
        <div>Protected</div>

        <div class="flex gap-2 py-3">
          <button onClick={logIn}>logIn</button>

          <button onClick={logOut}>logOut</button>
        </div>

        <a href="/protected/test2">To protected Page</a>
      </Section>
    </main>
  );
}
