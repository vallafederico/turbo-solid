import { type JSX, splitProps } from "solid-js";

type OverlayProps = JSX.HTMLAttributes<HTMLDivElement>;

/**
 * Stacks on top of its grid siblings without `position: absolute`.
 *
 * Wrap the parent in `display: grid` (e.g. `class="grid"`) and the
 * Overlay will share the same single grid cell as its siblings, sized to
 * match the largest sibling. Pass `class` / `style` to override.
 */
export default function Overlay(props: OverlayProps) {
  const [local, rest] = splitProps(props, ["style"]);

  return (
    <div
      {...rest}
      style={
        typeof local.style === "string"
          ? `grid-area: 1 / 1; ${local.style}`
          : { "grid-area": "1 / 1", ...local.style }
      }
    />
  );
}
