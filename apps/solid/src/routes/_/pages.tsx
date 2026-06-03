import { Title } from "@solidjs/meta";
import { useCrossFade } from "@acme/router";
import type { RouteSectionProps } from "@solidjs/router";

/** Slow cross-fade so outgoing and incoming pages overlap in the stack. */
const CROSSFADE_MS = 900;

export default function PagesLayout(props: RouteSectionProps) {
  useCrossFade(CROSSFADE_MS);

  return <>{props.children}</>;
}
