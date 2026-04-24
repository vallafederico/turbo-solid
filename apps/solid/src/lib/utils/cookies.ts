import { deleteCookie, parseCookies, setCookie } from "vinxi/http";

const server = typeof window === "undefined";

// (*) TO BE TESTED

/** -- Client */
export function parseCookiesClient(): { [key: string]: string } {
  // if (server) {
  //   return parseCookies();
  // } else {
  return document.cookie
    .split(";")
    .reduce((acc: { [key: string]: string }, cookie) => {
      const [key, value] = cookie.split("=");
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
  // }
}

export function setCookieClient(
  //   evt: Event,
  name: string,
  value: string,
  days = 1,
) {
  // if (server) {
  //   setCookie(name, value, {
  //     maxAge: days * 24 * 60 * 60,
  //   });
  // } else {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
  // }
}

export function removeCookieClient(name: string) {
  // if (server) {
  //   deleteCookie(name);
  // } else {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  // }
}
