export default function Home() {
  return (
    <main className="px-gx py-xxl">
      <section className="contain flex min-h-svh flex-col justify-between gap-xl">
        <p className="text-sm uppercase opacity-60">Next parity shell</p>

        <div className="max-w-4xl">
          <h1 className="text-xxl leading-none tracking-[-0.05em]">
            Solid foundation, React surface.
          </h1>
          <p className="mt-md max-w-2xl text-md opacity-70" data-selectable>
            This page exercises the shared Tailwind tokens, the Lenis scroll
            wrapper, GSAP-driven RAF, and the debug grid. Press{" "}
            <span className="font-bold">Shift+G</span> to toggle the grid.
          </p>
        </div>

        <a animate-hover="underline" className="w-fit text-sm" href="#motion">
          Scroll to motion utilities
        </a>
      </section>

      <section className="contain grid min-h-svh content-center gap-md" id="motion">
        <p className="text-sm uppercase opacity-60">Animation utilities</p>
        <h2 className="max-w-3xl text-xl leading-none tracking-[-0.04em]">
          Lenis and GSAP are now wired as app primitives.
        </h2>
        <p className="max-w-2xl text-md opacity-70" data-selectable>
          WebGL stays separate for now, but the scroll and RAF APIs keep the
          same shape needed by future DOM tracking and canvas integrations.
        </p>
      </section>
    </main>
  );
}
