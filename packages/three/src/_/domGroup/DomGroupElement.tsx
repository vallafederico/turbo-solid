import cx from "classix";
import { useWebglNode } from "../../../hooks/useWebglNode";
import { DomGroup } from ".";

export default function DomGroupElement({
  children,
  class: className,
}: {
  children?: any;
  class?: string;
}) {
  const { setRef, ref, node } = useWebglNode(DomGroup);

  return (
    <div ref={setRef} class={cx("aspect-5/7 w-[100vw] border", className)}>
      {children}
    </div>
  );
}
