import type { RouteSectionProps } from "@solidjs/router";
import { usePagesCoverTransition } from "~/animation/pages-transition";

export default function PagesLayout(
  props: RouteSectionProps,
) {
  usePagesCoverTransition();

  return <>{props.children}</>;
}
