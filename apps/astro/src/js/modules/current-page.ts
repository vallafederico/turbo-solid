import type { ModuleInstance } from "@local/modules";

/** Marks the in-page nav link that matches the current path. */
export class CurrentPageModule implements ModuleInstance {
  #root: HTMLElement;

  constructor(element: HTMLElement) {
    this.#root = element;
  }

  start() {
    this.update();
  }

  update() {
    const path = window.location.pathname.replace(/\/$/, "") || "/";
    for (const link of this.#root.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const href = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "") || "/";
      const active = href === path;
      link.dataset.active = String(active);
      link.classList.toggle("opacity-40", !active);
    }
  }
}
