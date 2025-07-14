import { useBeforeLeave } from "@solidjs/router";
import { animateOut } from ".";

export default function PageTransition({ children }: any) {
  useBeforeLeave(async (e: any) => {
    e.preventDefault();
    await animateOut();
    e.retry(true);
  });

  return <>{children}</>;
}
