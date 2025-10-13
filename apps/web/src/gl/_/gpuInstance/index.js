import {
  InstancedMesh,
  RawShaderMaterial,
  DoubleSide,
  SphereGeometry,
} from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";

import { setUvs, calculateRandomPosition } from "./utils";

import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";
import sim1Frag from "./sim1.frag";

import { Gl } from "../../gl";

const WIDTH = 150;
const size = 0.01;
const res = 8;
const scale = 1;

export class GpuInstance extends InstancedMesh {
  ison = false;
  gpu = new GPUComputationRenderer(WIDTH, WIDTH, Gl.renderer);

  createSim = () => {
    const texture = this.gpu.createTexture();
    calculateRandomPosition(texture, 1.5);

    const computeVariable = this.gpu.addVariable(
      "u_texture",
      sim1Frag,
      texture,
    );

    this.gpu.setVariableDependencies(computeVariable, [computeVariable]);
    const computeUniforms = computeVariable.material.uniforms;

    computeUniforms["u_time"] = { value: 0 };
    computeUniforms["u_mouse"] = { value: [0, 0, 0] };
    computeUniforms["u_texture"] = { value: texture };
    computeUniforms["u_original"] = { value: texture.clone() };

    return computeVariable;
  };

  constructor() {
    super(new SphereGeometry(size, res, res), new Material(), WIDTH * WIDTH);
    this.scale.set(scale, scale, scale);

    setUvs(this.geometry, WIDTH);

    this.computeMaterial = this.createSim();

    this.gpu.init();
    this.ison = true;
  }

  render(t) {
    if (!this.ison) return;
    this.material.time = t;

    this.computeMaterial.material.uniforms.u_time.value = t;
    this.computeMaterial.material.uniforms.u_mouse.value = [
      Gl.mouse.ex,
      Gl.mouse.ey,
      Gl.mouse.espeed,
    ];

    this.gpu.compute();

    this.material.uniforms.u_position_texture.value =
      this.gpu.getCurrentRenderTarget(this.computeMaterial).texture;
  }
}

class Material extends RawShaderMaterial {
  constructor() {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_mouse: { value: [0, 0, 0] },
        u_position_texture: { value: null },
      },
      side: DoubleSide,
      transparent: true,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}

// utils
