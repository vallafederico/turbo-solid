import { Group } from "three";
import { Scroll, Resizer, clientRectGl } from "@local/gl-context";

export class DomGroup extends Group {
  #resizeUnsub = () => {};
  #scrollUnsub = () => {};

  #ctrl = {
    x: 0,
    y: 0,
  };

  constructor(item) {
    super();
    this.item = item;
    if (Resizer) this.#resizeUnsub = Resizer.add(this.#resize.bind(this));
    if (Scroll) this.#scrollUnsub = Scroll.add(this.#scroll.bind(this), 0, Symbol("node"));

    this.#resize();

    setTimeout(() => {
      this.#resize();
    }, 50);
  }

  #resize() {
    if (!clientRectGl || !this.item) return;
    const rect = clientRectGl(this.item);
    this.#ctrl.x = this.position.x = rect.centerx;
    this.#ctrl.y = rect.centery;
    this.position.y = this.#ctrl.y + (Scroll?.gl ?? 0);

    if (this.resize) this.resize(rect);
  }

  #scroll({ velocity, scroll, direction, progress, glScroll }) {
    if (!this.inView) return;
    this.position.y = this.#ctrl.y + (glScroll ?? Scroll?.gl ?? 0);

    if (this.scroll) this.scroll({ velocity, scroll, direction, progress });
  }

  dispose() {
    this.#resizeUnsub();
    this.#scrollUnsub();
    this.parent.remove(this);
  }
}
