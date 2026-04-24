import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getProtectedData() {
  const cookieStore = await cookies();
  if (!cookieStore.get("auth")) redirect("/_/protected");

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
}
