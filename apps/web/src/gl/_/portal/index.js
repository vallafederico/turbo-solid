import { Scene, RawShaderMaterial, DoubleSide } from "three";

import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";

const size = 1;
const res = 1;

// (*) should it be directly a scene or a simple something else

export class Portal extends Scene {
  constructor() {
    super();
  }

  render(t) {
    // console.log(t);
  }
}

// class Material extends RawShaderMaterial {
//   constructor(options) {
//     super({
//       vertexShader,
//       fragmentShader,
//       uniforms: {
//         u_time: { value: options?.u_time || 0 },
//         u_t1: { value: options?.u_t1 || null },
//       },
//       side: DoubleSide,
//       wireframe: false,
//       transparent: true,
//     });
//   }

//   set time(t) {
//     this.uniforms.u_time.value = t;
//   }
// }
