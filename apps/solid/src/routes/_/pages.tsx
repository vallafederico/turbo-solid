import { useCoverSlideUp } from "@acme/router";
import type { RouteSectionProps } from "@solidjs/router";

/** Incoming page slides up from half a screen below over 3s, then outgoing unmounts. */
const SLIDE_MS = 3000;

export default function PagesLayout(
  props: RouteSectionProps,
) {
  useCoverSlideUp(SLIDE_MS);

  return <>{props.children}</>;
}
