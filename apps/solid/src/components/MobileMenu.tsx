import { For, Ref } from "solid-js";
import "./MobileMenu.css";
import { useBeforeLeave } from "@solidjs/router";

const closeOnLeave = (self: HTMLInputElement) => {
  useBeforeLeave(() => {
    if (self && self.checked) self.checked = false;
  });
};

export default function MobileMenu({ children }: { children: any }) {
  return (
    <div data-dropdown="wrapper" class="pointer-events-auto md:hidden">
      {/* icon */}
      <button class="relative z-20 aspect-square size-[2rem]">
        <div
          data-dropdown="icon"
          class="flex-center absolute inset-0 size-full flex-col"
        >
          <For each={Array.from({ length: 3 })}>
            {() => <div class="absolute h-[1px] w-full bg-white"></div>}
          </For>
        </div>
        <input
          use:closeOnLeave
          type="checkbox"
          class="absolute inset-0 size-full scale-150"
        />
      </button>

      {/* expandable */}
      <aside
        data-dropdown="content"
        class="fixed top-0 left-0 z-10 w-full bg-black"
      >
        <div class="overflow-hidden">
          <div class="flex h-screen items-center bg-gray-900 p-8">
            {children}
          </div>
        </div>
      </aside>
    </div>
  );
}
