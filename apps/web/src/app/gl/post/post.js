import { Gl } from "../gl";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

import { Shader } from "./base";

export class Post extends EffectComposer {
  isOn = true;

  constructor() {
    super(Gl.renderer);

    this.renderPass = new RenderPass(Gl.scene, Gl.camera);
    this.addPass(this.renderPass);

    this.createPasses();
  }

  createPasses() {
    this.main = new Shader();
    this.addPass(this.main);
  }

  renderPasses(t) {
    this.main.uniforms.u_time.value = Gl.time;
  }

  renderPost(t) {
    if (this.isOn) {
      this.renderPasses(t);
      this.render();
    } else {
      Gl.renderer.render(Gl.scene, Gl.camera);
    }
  }
}
