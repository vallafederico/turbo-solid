import type { SanityDocumentStub } from "@sanity/client";
import { Show, Suspense } from "solid-js";
import type { JSX } from "solid-js";
import { SanityMeta } from "..";

interface SanityPageProps {
  children: (data: SanityDocumentStub) => JSX.Element;
  fetcher?: any;
  class?: string;
}

export default function SanityPage({
  children,
  fetcher = () => {},
  class: className,
}: SanityPageProps) {
  return (
    <div class={`min-h-screen ${className}`}>
      <Show when={fetcher()}>
        {/* <SanityMeta title={data.title} /> */}
        {children(fetcher())}
      </Show>
    </div>
  );
}
