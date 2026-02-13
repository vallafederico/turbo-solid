const EACH_DELAY = 0.012;

export const RollingText = ({
  children,
  class: className,
  ...rest
}: {
  children: string;
  class?: string;
}) => {
  return (
    <p
      {...rest}
      data-target={children}
      animate-hover="roll"
      class={`group overflow-hidden ${className ?? ""}`.trim()}
      aria-label={children}
    >
      {children.split("").map((char, index) => (
        <span
          aria-hidden="true"
          class={`ease-expo-out relative inline-block
          transition-all duration-500
          text-shadow-[0_1.3em_0_currentColor]
          group-hover:-translate-y-[1.3em]`}
          style={`transition-delay: calc(${index} * ${EACH_DELAY}s);`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
};
