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
    <div class="min-h-[100vh] bg-neutral-950 pt-24 text-white">
      <Title>Page transitions</Title>
      <TransitionBadge />

      <div class="px-gx mx-auto max-w-3xl py-12">
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-white/40">
          @acme/router · dual-mount
        </p>
        <h1 class="mb-4 text-4xl font-semibold tracking-tight">
          Pages overlap demo
        </h1>
        <p class="mb-10 max-w-xl text-lg leading-relaxed text-white/70">
          Each screen is a full branch in the router stack. Navigate between
          colors — both the previous and next page stay mounted while they
          cross-fade. Watch the badge in the corner for branch role and phase.
        </p>

        <ul class="grid gap-4 sm:grid-cols-3">
          {DEMOS.map((demo) => (
            <li>
              <A
                href={demo.href}
                class={`flex min-h-40 items-end rounded-2xl p-6 text-2xl font-bold text-white shadow-lg transition ${demo.class}`}
              >
                {demo.name}
              </A>
            </li>
          ))}
        </ul>

        <p class="mt-12 text-sm text-white/45">
          Tip: use browser back after visiting a color page — direction-aware
          transitions use the same overlap stack.
        </p>
      </div>
    </div>
  );
}
