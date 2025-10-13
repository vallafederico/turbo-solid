import {
  InstancedMesh,
  PlaneGeometry,
  InstancedBufferAttribute,
  RawShaderMaterial,
  DoubleSide,
} from "three";

import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";

import { Gl } from "../gl";

// (*) add gpgpu basic functionality and make a GpuInstance class
// -- try rendering the canvas to worker with offscreenCanvas

const num = 50;
const size = 0.03;
const res = 8;
const scale = 1;

export class Instance extends InstancedMesh {
  constructor() {
    super(new PlaneGeometry(size, size), new Material(), num);
    this.scale.set(scale, scale, scale);

    this.geometry.setAttribute(
      "a_position",
      new InstancedBufferAttribute(getRandomData(), 4),
    );
  }

  render(t) {
    this.material.time = t;
  }
}

class Material extends RawShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
      },
      side: DoubleSide,
      transparent: true,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}

// --- utils
function getRandomData(amount = 4) {
  const data = new Float32Array(num * amount);
  for (let i = 0; i < num * amount; i++) {
    data[i + 0] = Math.random() * 2 - 1;
    data[i + 1] = Math.random() * 2 - 1;
    data[i + 2] = Math.random() * 2 - 1;
    data[i + 3] = Math.random();
  }
  return data;
}
