import { Group } from "three";
import { Resizer } from "../resizer";
import { Scroll } from "../../scroll";
import { clientRectGl } from "~/lib/utils/clientRect";
import { Gl } from "../gl";

export class DomGroup extends Group {
  // inView = true;
  #id = Resizer.subscribe(this.#resize.bind(this));
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
    Resizer.unsubscribe(this.#id);
    this.#scrollUnsub();
    this.parent.remove(this);
  }
}
