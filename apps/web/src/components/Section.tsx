export default function Section({
  children,
  class: className,
  ...rest
}: {
  children: any;
  class?: string;
}) {
  return (
    <section {...rest} class={className ? className + "" : ""}>
      {children}
    </section>
  );
}
