import "./MobileMenu.css";

export default function MobileMenu({ children }: { children: any }) {
  return (
    <div data-dropdown="wrapper" class="md:hidden">
      {/* icon */}
      <button class="relative z-20 aspect-square size-[3rem] outline">
        <input type="checkbox" class="absolute inset-0 size-full" />X
      </button>

      {/* expandable */}
      <aside
        data-dropdown="content"
        class="fixed top-0 left-0 z-10 w-full bg-black"
      >
        <div class="overflow-hidden">
          <div class="p-8">{children}</div>
        </div>
      </aside>
    </div>
  );
}
