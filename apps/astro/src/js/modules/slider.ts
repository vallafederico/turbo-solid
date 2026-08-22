import Core from "smooothy";
import type { ModuleInstance } from "@local/modules";
import gsap from "../gsap";

export class SliderModule implements ModuleInstance {
  #slider: Core | null = null;
  #tick: (time: number) => void;

  constructor(element: HTMLElement) {
    this.#slider = new Core(element);
    this.#tick = () => this.#slider?.update();
  }

  start() {
    gsap.ticker.add(this.#tick);
  }

  destroy() {
    gsap.ticker.remove(this.#tick);
    this.#slider?.destroy();
    this.#slider = null;
  }
}
