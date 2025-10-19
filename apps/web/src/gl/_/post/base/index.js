import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";

export class Shader extends ShaderPass {
  constructor() {
    super({
      uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
        u_screen: { value: null },
        u_time: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });
  }
}
