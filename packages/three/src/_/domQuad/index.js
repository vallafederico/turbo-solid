import { Mesh, PlaneGeometry, RawShaderMaterial, DoubleSide } from "three";
import { Scroll, Resizer, clientRectGl } from "@local/gl-context";
import { Gl } from "../../gl";

import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";

const size = 1;
const res = 1;

export class DomQuad extends Mesh {
  #resizeUnsub = () => {};
  #scrollUnsub = () => {};

  geometry = new PlaneGeometry(size, size, res, res);
  material = new Material();

  #ctrl = {
    x: 0,
    y: 0,
  };

  constructor(item) {
    super();
    this.item = item;
    if (Resizer) this.#resizeUnsub = Resizer.add(this.#resize.bind(this));
    if (Scroll) this.#scrollUnsub = Scroll.add(this.#scroll.bind(this));
    this.#resize();

    setTimeout(() => {
      this.#resize();
    });
  }

  #resize() {
    if (!clientRectGl || !this.item) return;
    const rect = clientRectGl(this.item);
    this.#ctrl.x = this.position.x = rect.centerx;
    this.#ctrl.y = rect.centery;
    this.position.y = this.#ctrl.y + (Scroll?.gl ?? 0);
    this.scale.set(rect.width, rect.height, 1);

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
    this.geometry.dispose();
    this.material.dispose();
  }

  onMouseEnter() {}

  onMouseLeave() {}
}

class Material extends RawShaderMaterial {
  constructor(options) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: options?.u_time || 0 },
        u_t1: { value: options?.u_t1 || null },
      },
      side: DoubleSide,
      wireframe: false,
      transparent: true,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}
