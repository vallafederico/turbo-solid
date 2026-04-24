"use client";

import { useRouter } from "next/navigation";

export default function ProtectedActions() {
  const router = useRouter();

  const logIn = () => {
    document.cookie = "auth=true; path=/; max-age=86400; SameSite=Lax";
    router.push("/_/protected/test2");
  };

  const logOut = () => {
    document.cookie = "auth=; path=/; max-age=0; SameSite=Lax";
    router.refresh();
  };

  return (
    <div className="flex gap-2 py-3">
      <button onClick={logIn} type="button">
        logIn
      </button>
      <button onClick={logOut} type="button">
        logOut
      </button>
    </div>
  );
}
