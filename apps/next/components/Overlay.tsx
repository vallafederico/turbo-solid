import type { ComponentPropsWithoutRef } from "react";

type OverlayProps = ComponentPropsWithoutRef<"div">;

/**
 * Stacks on top of its grid siblings without `position: absolute`.
 *
 * Wrap the parent in `display: grid` (e.g. `className="grid"`) and the
 * Overlay will share the same single grid cell as its siblings, sized to
 * match the largest sibling. Pass `className` / `style` to override.
 */
export default function Overlay({ style, ...rest }: OverlayProps) {
  return <div {...rest} style={{ gridArea: "1 / 1", ...style }} />;
}
