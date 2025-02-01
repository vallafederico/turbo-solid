import { useLocation, useNavigate } from "@solidjs/router";
import { animateOutAndTransition } from "~/animation/";
import { A } from "@solidjs/router";

// https://docs.solidjs.com/solid-router/reference/primitives/use-before-leave

export default function Aa({
  children,
  to,
  class: className,
  ...rest
}: {
  children: any;
  to: string;
  class?: string;
}) {
  let el!: HTMLAnchorElement;
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = async (e: any) => {
    e.preventDefault();
    await animateOutAndTransition(to, el, navigate, location);
  };

  return (
    <A
      ref={el}
      onClick={handleClick}
      href={to}
      class={className ? className + " inline-block" : "inline-block"}
      {...rest}
    >
      {children}
    </A>
  );
}
