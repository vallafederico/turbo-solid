import cx from "classix";
import { useWebglNode } from "./useWebglNode";
import { DomGroup } from "../_/domGroup";

export interface DomGroupElementProps {
  children?: any;
  class?: string;
}

export default function DomGroupElement(props: DomGroupElementProps) {
  const { setRef } = useWebglNode(DomGroup);

  return (
    <div ref={setRef} class={cx("aspect-5/7 w-[10vw] border", props.class)}>
      {props.children}
    </div>
  );
}
