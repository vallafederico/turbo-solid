import type { ModuleInstance } from "@local/modules";

/**
 * Overlay grid — Shift+G, same as Solid/Next and the Study Hall overlay habit.
 */
export class GridModule implements ModuleInstance {
  #root: HTMLElement;
  #onKey: (event: KeyboardEvent) => void;
  #onResize: () => void;

  constructor(element: HTMLElement) {
    this.#root = element;
    this.#onKey = (event) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "g") return;
      const next = this.#root.dataset.visible !== "true";
      this.#setVisible(next);
      localStorage.setItem("grid", String(next));
    };
    this.#onResize = () => this.#paint();
  }

  start() {
    const stored = localStorage.getItem("grid") === "true";
    this.#setVisible(stored);
    document.addEventListener("keydown", this.#onKey);
    window.addEventListener("resize", this.#onResize);
  }

  resize() {
    this.#paint();
  }

  destroy() {
    document.removeEventListener("keydown", this.#onKey);
    window.removeEventListener("resize", this.#onResize);
  }

  #setVisible(visible: boolean) {
    this.#root.dataset.visible = String(visible);
    this.#root.classList.toggle("invisible", !visible);
    this.#paint();
  }

  #paint() {
    const columns = Number(
      getComputedStyle(document.documentElement).getPropertyValue("--columns"),
    );
    const count = Number.isFinite(columns) && columns > 0 ? columns : 12;
    if (this.#root.childElementCount === count) return;
    this.#root.replaceChildren(
      ...Array.from({ length: count }, () => {
        const col = document.createElement("div");
        col.className = "grow bg-red-500 opacity-10";
        return col;
      }),
    );
  }
}
