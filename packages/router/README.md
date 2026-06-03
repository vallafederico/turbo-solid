## `@acme/router`

A custom router for SolidStart, built as a thin layer over `@solidjs/router`. Routing behaviour (matching, preload, `query`/`createAsync`, actions, `<A>`, `useNavigate`, `useBeforeLeave`) is the upstream implementation, untouched. The only divergence is the render layer: the matched route is funnelled through a stack that can hold the **previous and next page mounted at the same time**, which is what enables contextual page transitions — cross-fade overlap, directional slide, and shared-element / FLIP.

This replaces the previous approach of hijacking `useBeforeLeave`, fading `main`/`footer` by hand, and polling `useIsRouting()` with `requestAnimationFrame` until the swap settled. That pattern can only ever animate one mounted subtree, so it can't overlap two pages.

### Why a fork of the render layer (and not a wrapper)

In `@solidjs/router` 0.10+, the matched route renders into the layout's `props.children` through an internal, `Transition`-wrapped render. There is no `<Outlet>` seam, and exactly one matched branch is live at any moment. A pure wrapper can observe `useIsRouting()` and animate that single subtree, but it can never hold the outgoing page mounted alongside the incoming one — so it can't do contextual transitions. To keep both pages alive, the package owns the swap: each branch renders the route output inside its own detached `createRoot`, and the outgoing root is disposed only after its leave animation resolves. (This is the same technique `solid-transition-group` uses to keep leaving elements in the DOM.)

On the server and during hydration, route output is rendered directly (no
`BranchStack` in the HTML). Dual-mount activates after `onMount` on the client.
In monorepos, pin one `@solidjs/router` version (`pnpm.overrides`) and use
`vite.resolve.dedupe` so layout `<A>` links share the same router context.

### Migration

Change the import. Everything else keeps working:

```diff
- import { Router, Route, A, useNavigate } from "@solidjs/router";
+ import { Router, Route, A, useNavigate } from "@acme/router";
```

`@acme/router` re-exports the entire `@solidjs/router` surface, then shadows `Router` with the transition-aware version. Opt out per-instance with `transition={false}` to get byte-for-byte stock behaviour.

### Enabling transitions

```tsx
import { Router, Route } from "@acme/router";

<Router root={Layout} transition={{ timeoutMs: 1200 }}>
  <Route path="/" component={Home} />
  <Route path="/work/:slug" component={Project} />
</Router>;
```

`transition` options:

- `timeoutMs` (default `1200`) — safety ceiling. A branch is force-unmounted after its animation resolves *or* this timeout, whichever comes first, so a missing/never-resolving promise can never wedge navigation.
- `hideIncomingUntilEnter` (default `false`) — mount the incoming page with `visibility: hidden` until its enter runner begins (useful if the incoming page flashes before its enter animation sets initial state).

### Animating a page

Call the hooks inside any page component. Registration is component-scoped and auto-cleaned on unmount — no global registry to reset.

```tsx
import { onEnter, onLeave } from "@acme/router";

export default function Project() {
  onLeave((_ctx, el) =>
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "both" })
      .finished,
  );
  onEnter((_ctx, el) =>
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, fill: "both" })
      .finished,
  );

  return <article>…</article>;
}
```

A runner receives the branch context and the branch's root element, and returns a promise (or nothing). The router holds the outgoing branch mounted until the leave promise resolves. Any animation library works — the contract is just "return a promise that settles when you're done."

Built-in presets (zero-dependency, Web Animations API):

```tsx
import { useCrossFade, useDirectionalSlide } from "@acme/router";

useCrossFade(400);          // overlapping fade
useDirectionalSlide(48, 450); // back/forward aware slide
```

For GSAP, write a runner that resolves on completion:

```tsx
import gsap from "gsap";
onLeave((_ctx, el) =>
  new Promise<void>((res) => {
    gsap.to(el, { opacity: 0, duration: 0.4, onComplete: res });
  }),
);
```

### Reading transition state

```tsx
import { useRouteTransition, useTransitionDirection } from "@acme/router";

const t = useRouteTransition();
// t.role        -> "incoming" | "outgoing"
// t.phase()     -> "idle" | "entering" | "leaving"
// t.progress()  -> 0 → 1 across the whole transition
// t.direction() -> "forward" | "backward" | "replace" | "none"
```

Direction is derived from a monotonic index stamped into `history.state`, so native back/forward is detected reliably rather than guessed.

### Shared-element / FLIP transitions

```tsx
import { useSharedElement, onEnter } from "@acme/router";

function Thumbnail() {
  const hero = useSharedElement("project-cover");
  return <img ref={hero.ref} src={cover} />;
}

function Project() {
  const hero = useSharedElement("project-cover");
  onEnter((_ctx, el) => {
    const prev = hero.previousRect();      // rect captured on the outgoing page
    if (!prev) return;
    const now = el.getBoundingClientRect(); // first
    const dx = prev.left - now.left;
    const dy = prev.top - now.top;
    const sx = prev.width / now.width;
    const sy = prev.height / now.height;
    return el.animate(                       // invert + play
      [
        { transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` },
        { transform: "none" },
      ],
      { duration: 500, easing: "cubic-bezier(.2,0,0,1)", fill: "both" },
    ).finished;
  });
  return <img ref={hero.ref} src={cover} />;
}
```

The hook records the outgoing element's geometry at leave-time under the shared id; the incoming page reads it and does the FLIP. The tween is left to you so any easing/library works.

### Skipping a transition

For filter/sort/variant changes where you want an instant in-place swap, navigate to a URL that resolves to the **same matched leaf**. Two URLs matching the same leaf keep the same branch key and swap with no transition — consistent with the upstream rule that same-match routes are the same route. (This replaces the old `skipPageTransition()` / `skipTransitionClick` flag dance.)

### How your old `usePageTransition` maps over

| Old | New |
| --- | --- |
| `setOutTransition(fn)` + manual `onCleanup` | `beforeLeave(fn)` (auto-scoped, runs before branch leave) |
| `usePageTransition()` in layout | `useLayoutTransition({ leave, enter, onEnter })` |
| `gsap.to(["main","footer"], …)` by hand | `leave` / `enter` runners in `useLayoutTransition`, or per-page `onEnter` / `onLeave` |
| `useIsRouting()` rAF polling (`whenRoutingSettled`) | the router awaits your returned promise |
| `skipNextTransition` / `skipTransitionClick` | navigate to the same matched leaf |
| `popstate` listener for scroll reset | `useTransitionDirection()` + your scroll lib |
| global `outTransitions` array + `reset()` | component-scoped registration |

### Known limitations (read before adopting)

- **Double component execution.** Because the package layers on the `root` prop rather than forking `Routes` itself, the matched route component executes twice per navigation: once in the router's own render (discarded) and once in the detached root that reaches the DOM. For pages whose work is wrapped in `query`/`createAsync` this is deduped and harmless, but a raw side-effect in `onMount` or a non-deduped fetch will run twice. Eliminating this requires forking `Routes` one layer deeper — a planned follow-up.
- **Scroll restoration is yours to drive.** The package does not reset or restore scroll; wire it from `onEnter` using `direction()` and your scroll library, as the old code did with Lenis.
- **Hydration timing.** The branch element is handed to the controller via `queueMicrotask`; this has not been exercised against streaming hydration edge cases. Verify on your slowest route before shipping.

### Layout

```
packages/router/
  src/
    index.ts                  re-exports + Router shadow
    router.tsx                public <Router>
    types.ts
    transitions/
      controller.ts           state machine, direction, promise coordination
      context.ts              controller + per-branch Solid contexts
      branch-stack.tsx        detached-root dual-mount renderer
      hooks.ts                useRouteTransition / onEnter / onLeave / useSharedElement
      presets.ts              useCrossFade / useDirectionalSlide
```
