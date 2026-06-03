import { Title } from "@solidjs/meta";
import { A } from "@acme/router";
import TransitionBadge from "~/components/pages/TransitionBadge";

const SIBLINGS = [
  { href: "/_/pages/red", name: "Red", active: false },
  { href: "/_/pages/blue", name: "Blue", active: false },
  { href: "/_/pages/green", name: "Green", active: true },
] as const;

export default function PagesGreen() {
  return (
    <div class="relative flex min-h-[100svh] flex-col bg-emerald-500 pt-24 text-white">
      <Title>Green · page transition</Title>
      <TransitionBadge />

      <div class="flex flex-1 flex-col justify-between px-gx py-12">
        <div>
          <p class="font-mono text-sm uppercase tracking-widest text-emerald-100/80">
            Both branches live
          </p>
          <h1 class="mt-2 text-6xl font-black tracking-tighter md:text-8xl">
            Green
          </h1>
          <p class="mt-6 max-w-md text-lg text-emerald-50/90">
            Open devtools and inspect{" "}
            <code class="rounded bg-black/20 px-1.5 py-0.5 text-sm">
              [data-router-branch]
            </code>{" "}
            — you will see two nodes during the transition.
          </p>
        </div>

        <nav class="flex flex-wrap gap-3">
          {SIBLINGS.map((link) => (
            <A
              href={link.href}
              class="rounded-full border-2 border-white/40 px-5 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20"
              classList={{
                "bg-white text-emerald-700 border-white": link.active,
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
