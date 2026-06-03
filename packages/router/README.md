## `@acme/router`

A custom router for SolidStart, built as a thin layer over `@solidjs/router`. Routing behaviour (matching, preload, `query`/`createAsync`, actions, `<A>`, `useNavigate`, `useBeforeLeave`) is the upstream implementation, untouched. The only divergence is the render layer: the matched route is funnelled through a stack that can hold the **previous and next page visible at the same time**, which is what enables contextual page transitions — sequential leave→enter, cross-fade overlap, directional slide, cover, and shared-element / FLIP.

This replaces the previous approach of hijacking `useBeforeLeave`, fading `main`/`footer` by hand, and polling `useIsRouting()` with `requestAnimationFrame` until the swap settled.

### How it works

The package owns the swap layer only. Two transition modes:

- **Sequential (default).** `NavigationGate` intercepts link / programmatic navigations via `useBeforeLeave`, `preventDefault()`s, runs the current page's `beforeLeave` hooks + layout `leave` on the **live DOM**, then performs the navigation and runs `enter`. This is the "animate out, swap, animate in" model.
- **Overlap (custom presets).** When a layout registers a preset (`useCrossFade`, `useCoverSlideUp`, `useDirectionalSlide`), the gate snapshots the outgoing page as an inert **DOM clone**, stacks it underneath the incoming live route in the same grid cell, and runs the preset's `leave`/`enter` in parallel. The clone is disposed once the transition completes.

The live route always renders directly under the branch providers, so transition hooks (`beforeLeave`, `onEnter`, `useRouteTransition`) resolve correctly and route components execute exactly once.

On the server and during hydration, route output renders directly. In monorepos, pin one `@solidjs/router` version (`pnpm.overrides`) and use `vite.resolve.dedupe` so layout `<A>` links share the same router context.

### Migration

Change the import. Everything else keeps working:

```diff
- import { Router, Route, A, useNavigate } from "@solidjs/router";
+ import { Router, Route, A, useNavigate } from "@acme/router";
```

`@acme/router` re-exports the entire `@solidjs/router` surface, then shadows `Router` with the transition-aware version. Opt out per-instance with `transition={false}` for stock behaviour.

### Enabling transitions

```tsx
import { Router, Route } from "@acme/router";

<Router root={Layout} transition={{ timeoutMs: 1200 }}>
  <Route path="/" component={Home} />
  <Route path="/work/:slug" component={Project} />
</Router>;
```

`transition` options:

- `timeoutMs` (default `1200`) — safety ceiling for the **default/registered** runners. Custom presets self-size their safety to `max(timeoutMs, presetDuration + 500ms)`, so you don't need to bump this for a long preset.
- `hideIncomingUntilEnter` (default `false`) — mount the incoming page with `visibility: hidden` until its enter runner begins.

### Layout-level transition

Call once in the persistent shell. Drives the global leave/enter on the branch wrapper and a mount hook for scroll restoration.

```tsx
import { useLayoutTransition } from "@acme/router";

function Shell(props) {
  useLayoutTransition({
    durationMs: 400, // default fade
    onEnter: () => scrollToTop(), // fires only on real transitions
  });
  return <main>{props.children}</main>;
}
```

`leave` / `enter` are skipped automatically while a custom preset owns the transition, so presets fully replace the default fade (no double animation).

### Animating a page

Component-scoped, auto-cleaned on unmount — no global registry.

```tsx
import { onEnter, onLeave, beforeLeave } from "@acme/router";

export default function Project() {
  beforeLeave(() =>
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "both" })
      .finished,
  ); // page item tweens, run before the layout leave
  onEnter((_ctx, el) =>
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "both" })
      .finished,
  );
  return <article>…</article>;
}
```

A runner returns a promise (or nothing); the router awaits it. Any animation library works.

Built-in presets (zero-dependency, Web Animations API), registered in a **layout**:

```tsx
import { useCrossFade, useDirectionalSlide, useCoverSlideUp } from "@acme/router";

useCrossFade(400);            // overlapping fade
useDirectionalSlide(48, 450); // direction-aware slide
useCoverSlideUp(3000, "50vh"); // incoming slides up over the frozen outgoing page
```

For GSAP, write a runner that resolves on completion:

```tsx
onLeave((_ctx, el) =>
  new Promise<void>((res) => {
    gsap.to(el, { opacity: 0, duration: 0.4, onComplete: res });
  }),
);
```

### Reading transition state

```tsx
import { useRouteTransition } from "@acme/router";

const t = useRouteTransition();
// t.role        -> "incoming" | "outgoing"
// t.phase()     -> "idle" | "entering" | "leaving"
// t.progress()  -> 0 → 1 across the transition
// t.direction() -> "forward" | "replace" | "none"
```

### Shared-element / FLIP

```tsx
import { useSharedElement, onEnter } from "@acme/router";

function Project() {
  const hero = useSharedElement("project-cover");
  onEnter((_ctx, el) => {
    const prev = hero.previousRect();
    if (!prev) return;
    const now = el.getBoundingClientRect();
    return el.animate(
      [
        {
          transform: `translate(${prev.left - now.left}px,${prev.top - now.top}px) scale(${prev.width / now.width},${prev.height / now.height})`,
        },
        { transform: "none" },
      ],
      { duration: 500, easing: "cubic-bezier(.2,0,0,1)", fill: "both" },
    ).finished;
  });
  return <img ref={hero.ref} src={cover} />;
}
```

### Skipping a transition

Any navigation that keeps the **same matched route leaf** and only changes **query params** (filters, sort, variant options, pagination) swaps content in place — no leave/enter animation, no scroll reset, no mount hooks.

`NavigationGate` detects these via pathname comparison against the current branch key; `BranchStack` refreshes the live route; the controller skips all runners (including custom overlap presets) because no transition was started.

Pathname changes (e.g. a different product handle) still run the full transition.

### Known limitations (read before adopting)

- **Browser back/forward swaps instantly.** `popstate` can't be blocked, and the snapshot technique needs to capture the outgoing DOM *before* it swaps — which only the gate (link/programmatic navigations) can do. So back/forward currently has no leave/enter animation, and `direction()` only reports `forward` / `replace`. Animated, direction-aware back is a planned follow-up.
- **Overlap snapshots are inert DOM clones.** `<canvas>` bitmaps, media playback, live WebGL, and in-progress form input are not preserved on the frozen outgoing layer (`id`s are stripped to avoid duplicates). Fine for static page content; avoid overlap presets on pages dominated by live canvas/video.
- **Scroll offset uses `window.scrollY`.** The frozen outgoing layer is offset by the captured scroll so it stays put while the incoming page resets to top. This assumes window-level scrolling (Lenis default). If you scroll a custom wrapper, capture that value instead.

### Layout

```
packages/router/
  src/
    index.ts                  re-exports + Router shadow
    router.tsx                public <Router>, mounts NavigationGate + BranchStack
    types.ts
    transitions/
      controller.ts           state machine, runner pools, preset, safety timing
      context.ts              controller + per-branch Solid contexts
      branch-providers.tsx    branch context + beforeLeave registration wrapper
      branch-stack.tsx        live route + frozen outgoing clone renderer
      navigation-gate.tsx     useBeforeLeave interceptor (sequential leave / overlap snapshot)
      hooks.ts                useRouteTransition / onEnter / onLeave / beforeLeave / useSharedElement
      layout-transition.ts    useLayoutTransition (global leave/enter + mount hook)
      presets.ts              useCrossFade / useDirectionalSlide / useCoverSlideUp
```
