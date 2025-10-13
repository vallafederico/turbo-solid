import { Group } from "three";
import { Resizer } from "../../lib/utils/resizer";
import { Scroll } from "../../lib/utils/scroll";
import { clientRectGl } from "../../lib/utils/clientRect";
import { Gl } from "../gl";

export class DomGroup extends Group {
  // inView = true;
  #resizeUnsub = Resizer.add(this.#resize.bind(this));
  #scrollUnsub = Scroll.subscribe(this.#scroll.bind(this), Symbol("node"));

  #ctrl = {
    x: 0,
    y: 0,
  };

  constructor(item) {
    super();
    this.item = item;

    this.#resize();

    // (*) [BETTER] find a better solution to account for page transition
    setTimeout(() => {
      this.#resize();
    }, 50);
  }

  #resize() {
    const rect = clientRectGl(this.item);
    this.#ctrl.x = this.position.x = rect.centerx;
    this.#ctrl.y = rect.centery;
    this.position.y = this.#ctrl.y + Scroll.y * Gl.vp.px;

    if (this.resize) this.resize(rect);
  }

  #scroll({ velocity, scroll, direction, progress, glScroll }) {
    if (!this.inView) return;

    this.position.y = this.#ctrl.y + glScroll;

    if (this.scroll) this.scroll({ velocity, scroll, direction, progress });
  }

  dispose() {
    this.#resizeUnsub();
    this.#scrollUnsub();
    this.parent.remove(this);
  }
}
