"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { pageTransition } from "@/animation/page-transition";

export function useNavigate(): (href: string) => Promise<void> {
  const router = useRouter();

  return useCallback(
    (href: string) => pageTransition.navigate(href, router),
    [router],
  );
}
