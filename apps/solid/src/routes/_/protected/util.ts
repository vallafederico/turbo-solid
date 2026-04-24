import { query, redirect } from "@solidjs/router";
import { parseCookies } from "vinxi/http";

async function wait(time = 1): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000 * time);
  });
}

export const getData = query(async () => {
  "use server";

  console.log("...");
  await wait(3.4);
  console.log("done");

  const cookies = parseCookies();
  console.log("cookies", cookies.auth);

  if (!cookies.auth) {
    console.log("no auth, redirecting ...");
    return redirect("/_/protected/");
  }

  return {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
    website: "https://www.example.com",
  };
}, "test");
