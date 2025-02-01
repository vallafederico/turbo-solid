import cx from "classix";
import { useWebglNode } from "~/hooks/useWebglNode";
import { DomQuad } from ".";

export default function DomQuadElement({
  children,
  class: className,
}: {
  children?: any;
  class?: string;
}) {
  const { setRef, ref, node } = useWebglNode(DomQuad);

  return (
    <div ref={setRef} class={cx("aspect-5/7 w-[30vw] border", className)}>
      {children}
    </div>
  );
}
