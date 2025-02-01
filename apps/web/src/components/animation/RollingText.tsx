import "./RollingText.css";

export const RollingText = ({
  children,
  class: className,
  ...rest
}: {
  children: string;
  class?: string;
}) => {
  return (
    <p {...rest} target={children} animate-hover="roll" class={className}>
      <span>{children}</span>
    </p>
  );
};
