import cx from "classix";
import { useWebglNode } from "./useWebglNode";
import { DomQuad } from "../_/domQuad";

export interface DomQuadElementProps {
  children?: any;
  class?: string;
}

export default function DomQuadElement(props: DomQuadElementProps) {
  const { setRef } = useWebglNode(DomQuad);

  return (
    <div ref={setRef} class={cx("aspect-5/7 w-[30vw] border", props.class)}>
      {props.children}
    </div>
  );
}
