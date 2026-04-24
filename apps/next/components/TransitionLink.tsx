"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { isModifiedNavigationEvent } from "@/animation/page-transition";
import { usePageTransition } from "@/components/PageTransitionProvider";

type TransitionLinkProps = ComponentPropsWithoutRef<typeof Link>;

function isInternalHref(href: TransitionLinkProps["href"]): href is string {
  return typeof href === "string" && href.startsWith("/");
}

export default function TransitionLink({
  href,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || isModifiedNavigationEvent(event)) return;
    if (!isInternalHref(href)) return;

    event.preventDefault();
    void navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
