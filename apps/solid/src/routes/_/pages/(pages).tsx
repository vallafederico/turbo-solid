import { Title } from "@solidjs/meta";
import { A } from "@acme/router";
import TransitionBadge from "~/components/pages/TransitionBadge";

const DEMOS = [
  {
    href: "/_/pages/red",
    name: "Red",
    class: "bg-red-500 hover:bg-red-600",
  },
  {
    href: "/_/pages/blue",
    name: "Blue",
    class: "bg-blue-500 hover:bg-blue-600",
  },
  {
    href: "/_/pages/green",
    name: "Green",
    class: "bg-emerald-500 hover:bg-emerald-600",
  },
] as const;

export default function PagesDemoIndex() {
  return (
    <div class="pt-24 text-white min-h-svh bg-neutral-950">
      <Title>Page transitions</Title>
      <TransitionBadge />

      <div class="py-12 mx-auto max-w-3xl px-gx">
        <p
          class="mb-2 font-mono text-xs tracking-widest uppercase text-white/40"
        >
          @acme/router · dual-mount
        </p>
        <h1
          class="mb-4 text-4xl font-semibold tracking-tight"
        >
          Pages cover demo
        </h1>
        <p
          class="mb-10 max-w-xl text-lg leading-relaxed text-white/70"
        >
          Each screen is a full branch in the router stack.
          Navigate between colors — the incoming page
          fades in over 0.2s, slides up over 1.2s,
          while the previous page fades out slowly
          and clears just before the slide finishes.
          Watch the badge for branch role and phase.
        </p>

        <ul class="grid gap-4 sm:grid-cols-3">
          {DEMOS.map((demo) => (
            <li>
              <A
                href={demo.href}
                class={`flex min-h-40 items-end rounded-2xl
                p-6 text-2xl font-bold text-white shadow-lg
                transition ${demo.class}`}
              >
                {demo.name}
              </A>
            </li>
          ))}
        </ul>

        <p class="mt-12 text-sm text-white/45">
          Tip: use browser back after visiting a color page
          — direction-aware transitions use the same overlap
          stack.
        </p>
      </div>
    </div>
  );
}
