import { Group, RawShaderMaterial, DoubleSide } from "three";

import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";

import { Gl } from "../../gl";

const SCALE = 0.5;

export class Model extends Group {
  material = new Material();
  #raf = Gl.subscribe(this.render.bind(this));

  constructor(model) {
    super();

    this.mesh = findMesh(model, this.material);
    this.scale.set(SCALE, SCALE, SCALE);
    this.add(this.mesh);

    Gl.scene.add(this);
  }

  render() {}

  dispose() {
    this.#raf();
  }
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

// -- utils
function findMesh(obj, material = null) {
  let mesh;

  obj.traverse((child) => {
    if (child.isMesh === true) {
      child.material = material;
      mesh = child;
    }
  });

  return mesh;
}
