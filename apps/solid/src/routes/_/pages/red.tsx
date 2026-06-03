import { Title } from "@solidjs/meta";
import { A } from "@acme/router";
import TransitionBadge from "~/components/pages/TransitionBadge";

const SIBLINGS = [
  { href: "/_/pages/red", name: "Red", active: true },
  { href: "/_/pages/blue", name: "Blue", active: false },
  { href: "/_/pages/green", name: "Green", active: false },
] as const;

export default function PagesRed() {
  return (
    <div class="relative flex min-h-[100svh] flex-col bg-red-500 pt-24 text-white">
      <Title>Red · page transition</Title>
      <TransitionBadge />

      <div class="flex flex-1 flex-col justify-between px-gx py-12">
        <div>
          <p class="font-mono text-sm uppercase tracking-widest text-red-100/80">
            Outgoing branch
          </p>
          <h1 class="mt-2 text-6xl font-black tracking-tighter md:text-8xl">
            Red
          </h1>
          <p class="mt-6 max-w-md text-lg text-red-50/90">
            While the next page slides up from below, this branch stays mounted
            underneath until the cover animation finishes.
          </p>
        </div>

        <nav class="flex flex-wrap gap-3">
          {SIBLINGS.map((link) => (
            <A
              href={link.href}
              class="rounded-full border-2 border-white/40 px-5 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
              classList={{
                "bg-white text-red-600 border-white": link.active,
              }}
            >
              {link.name}
            </A>
          ))}
          <A
            href="/_/pages"
            class="rounded-full border-2 border-white/25 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-white/10"
          >
            Index
          </A>
        </nav>
      </div>
    </div>
  );
}
