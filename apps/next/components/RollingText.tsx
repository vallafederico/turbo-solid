const EACH_DELAY = 0.012;

export default function RollingText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <p
      animate-hover="roll"
      aria-label={children}
      className={`group overflow-hidden ${className}`.trim()}
      data-target={children}
    >
      {children.split("").map((char, index) => (
        <span
          aria-hidden="true"
          className="relative inline-block transition-all duration-500 ease-[var(--expo-out)] group-hover:-translate-y-[1.3em]"
          key={`${char}-${index}`}
          style={{
            textShadow: "0 1.3em 0 currentColor",
            transitionDelay: `calc(${index} * ${EACH_DELAY}s)`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
}
