import { Group, ShaderMaterial, DoubleSide } from "three";
import { Gl } from "../gl";

import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";

import { hexToVec3 } from "../utils/hexToVec3";

import { Mixer } from "./mixer";

const scale = 1;

// (*?) and check

export class Skinned extends Group {
  constructor({ model, animations }) {
    super();
    this.model = getMesh(model, Material);
    this.mixer = new Mixer(this.model);

    this.scale.set(scale, scale, scale);
    this.add(this.model);
  }

  render(t) {
    this.mixer.update(Gl.clock.getDelta());
  }
}

class Material extends ShaderMaterial {
  constructor(options) {
    super({
      vertexShader,
      fragmentShader,
      side: DoubleSide,
      // wireframe: true,
      transparent: true,
      uniforms: {
        u_time: { value: 0 },
        u_diff: { value: options.u_diff },
        u_col_bg: { value: hexToVec3(Gl.params.clearColor) },
      },
    });
  }

  set time(t) {
    console.log("hi");
    this.uniforms.u_time.value = t;
  }
}

// utils

function getMesh(model, material) {
  model.traverse((child) => {
    if (child.isSkinnedMesh) {
      if (material) {
        const { map } = child.material;
        // console.log(map)

        child.material = new material({ u_diff: map });
        // console.log(child.material)
      }
    }
  });

  return model;
}
