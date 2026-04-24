"use client";

import { useState } from "react";

const content = [
  {
    title: "Dropdown 1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    title: "Dropdown 2",
    content:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function Dropdown() {
  const [open, setOpen] = useState<number | false>(false);

  return (
    <div className="flex max-w-[40ch] flex-col gap-4">
      {content.map((item, index) => {
        const checked = open === index;

        return (
          <div
            className="rounded-md border border-gray-800"
            data-dropdown="wrapper"
            key={item.title}
          >
            <div className="relative flex items-center justify-between p-3">
              <p>{item.title}</p>
              <div
                className="flex aspect-square size-6 items-center justify-center"
                data-dropdown="icon"
              >
                <p>+</p>
              </div>

              <input
                checked={checked}
                onChange={() => setOpen(checked ? false : index)}
                type="checkbox"
              />
            </div>

            <div data-dropdown="content">
              <div>
                <div className="p-3">
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
