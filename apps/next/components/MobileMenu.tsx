"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";

export default function MobileMenu({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-auto md:hidden" data-dropdown="wrapper">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-20 aspect-square size-[2rem]"
        type="button"
      >
        <div
          className="flex-center absolute inset-0 size-full flex-col"
          data-dropdown="icon"
        >
          {Array.from({ length: 3 }, (_, index) => (
            <div className="absolute h-[1px] w-full bg-white" key={index} />
          ))}
        </div>
        <input
          checked={open}
          onChange={(event) => setOpen(event.target.checked)}
          type="checkbox"
        />
      </button>

      <aside
        className="fixed top-0 left-0 z-10 w-full bg-black"
        data-dropdown="content"
        onClickCapture={(event) => {
          if ((event.target as Element).closest("a")) setOpen(false);
        }}
      >
        <div className="overflow-hidden">
          <div className="flex h-screen items-center bg-gray-900 p-8">
            {children}
          </div>
        </div>
      </aside>
    </div>
  );
}
