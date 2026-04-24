import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<ComponentPropsWithoutRef<"section">>;

export default function Section({
  children,
  className = "",
  ...rest
}: SectionProps) {
  return (
    <section className={className} {...rest}>
      {children}
    </section>
  );
}
