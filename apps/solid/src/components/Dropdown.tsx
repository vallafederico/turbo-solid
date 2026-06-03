import "./Dropdown.css";
import {
  For,
  createSignal,
  type Accessor,
  type Setter,
  createEffect,
} from "solid-js";

const content = [
  {
    title: "Dropdown 1",
    content: () => (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    ),
  },
  {
    title: "Dropdown 2",
    content: () => (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    ),
  },
];

export default function Dropdown() {
  const [open, setOpen] = createSignal<false | number>(false);
  let previousOpen: number | false = false;
  const checkboxRefs: HTMLInputElement[] = [];

  createEffect(() => {
    const currentOpen = open();

    if (previousOpen !== false && previousOpen !== currentOpen) {
      const checkbox = checkboxRefs[previousOpen];
      if (checkbox) checkbox.checked = false;
    }

    previousOpen = currentOpen;
  });

  return (
    <div class="flex max-w-[40ch] flex-col gap-4">
      <For each={content}>
        {(item, index) => (
          <DropdownItem
            index={index}
            open={open}
            setOpen={setOpen}
            {...item}
            ref={(el) => (checkboxRefs[index()] = el)}
          />
        )}
      </For>
    </div>
  );
}

function DropdownItem(props: {
  title: string;
  content: () => any;
  index: Accessor<number>;
  open: Accessor<false | number>;
  setOpen: Setter<false | number>;
  ref: (el: HTMLInputElement) => void;
}) {
  return (
    <div data-dropdown="wrapper" class="rounded-md border border-gray-800">
      {/* head */}
      <div class="relative flex items-center justify-between p-3">
        <p>{props.title}</p>
        <div
          data-dropdown="icon"
          class="flex aspect-square size-6 items-center justify-center"
        >
          <p>+</p>
        </div>

        <input
          type="checkbox"
          class=""
          ref={props.ref}
          onInput={() => {
            if (props.open() === props.index()) {
              props.setOpen(false);
            } else {
              props.setOpen(props.index());
            }
          }}
        />
      </div>

      {/* content */}
      <div data-dropdown="content">
        <div>
          <div class="p-3">{props.content()}</div>
        </div>
      </div>
    </div>
  );
}
