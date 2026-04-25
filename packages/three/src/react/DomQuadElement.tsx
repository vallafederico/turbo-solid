"use client";

import cx from "classix";
import type { ReactNode } from "react";

import { DomQuad } from "../_/domQuad";
import { useWebglNode } from "./useWebglNode";

export interface ReactDomQuadElementProps {
  children?: ReactNode;
  className?: string;
}

export default function DomQuadElement({
  children,
  className,
}: ReactDomQuadElementProps) {
  const ref = useWebglNode(DomQuad);

  return (
    <div
      ref={ref}
      className={cx("aspect-5/7 w-[30vw] border", className ?? "")}
    >
      {children}
    </div>
  );
}
