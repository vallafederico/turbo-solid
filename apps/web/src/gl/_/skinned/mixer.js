import { AnimationMixer } from "three";
import { Gl } from "../../gl";

// (*?) this might break
if (Gl.clock === undefined) {
  Gl.clock = new Gl.Clock();
}

export class Mixer extends AnimationMixer {
  constructor(group) {
    super(group);

    this.action = this.clipAction(group.animations[2]);
    this.action.play();
  }
}
