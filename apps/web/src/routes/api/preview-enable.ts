import { APIEvent } from "node_modules/@solidjs/start/dist/server";

import { isValidPreviewUrl } from "@local/sanity/live-editing/server/utils";
import { sanityClient } from "@local/sanity";

export async function GET(event: APIEvent) {
  const url = new URL(event.request.url);
  const serverClient = sanityClient.withConfig({
    token: process.env.SANITY_API_TOKEN,
  });

  console.log("with token:: ", process.env.SANITY_API_TOKEN);

  const res = await isValidPreviewUrl(serverClient, url);

  console.log(res);

  return res;
  // console.log(isValid, redirectTo, studioPreviewPerspective);
  // const {
  //   isValid,
  //   redirectTo = "/",
  //   studioPreviewPerspective,
  // } = await previewUrlSecret.validatePreviewUrl(client, request.url);
  // if (!isValid) return new Response("Invalid secret", { status: 401 });
  // const draftModeStore = await headers.draftMode();
  // draftModeStore.isEnabled || draftModeStore.enable();
  // const dev = process.env.NODE_ENV !== "production",
  //   cookieStore = await headers.cookies(),
  //   cookie = cookieStore.get("__prerender_bypass");
  // return (
  //   cookieStore.set({
  //     name: "__prerender_bypass",
  //     value: cookie?.value,
  //     httpOnly: !0,
  //     path: "/",
  //     secure: !dev,
  //     sameSite: dev ? "lax" : "none",
  //   }),
  //   studioPreviewPerspective &&
  //     cookieStore.set({
  //       name: constants.perspectiveCookieName,
  //       value: studioPreviewPerspective,
  //       httpOnly: !0,
  //       path: "/",
  //       secure: !dev,
  //       sameSite: dev ? "lax" : "none",
  //     }),
  //   navigation.redirect(redirectTo)
  // );
}
