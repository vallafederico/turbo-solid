import { Scene as S } from "three";
import { Gl } from "./gl";
import { Quad } from "./quad";
import { Instance } from "./instance";
import { loadAssets } from "./utils/loader";
import { Model } from "./model";
import { GpuInstance } from "./gpuInstance";

// import { Node } from "./quadNode";

// (*) test and setup loader

export class Scene extends S {
  constructor() {
    super();

    // this.load();

    // this.quad = new Quad();
    // this.add(this.quad);

    // this.text = new Text();
    // this.add(this.text);

    // this.instance = new Instance();
    // this.add(this.instance);

    // setTimeout(() => {
    //   console.log(this.children);
    // }, 100);

    // this.gpuInstance = new GpuInstance();
    // this.add(this.gpuInstance);
  }

  async load() {
    this.assets = await loadAssets();
    console.log("::", this.assets);

    // this.model = new Model(this.assets.suzanne);
    // this.add(this.model);
  }

  render() {
    // this.gpuInstance.render();
  }

  resize() {}

  onScroll(scroll) {}

  dispose() {
    // this.children.forEach((child) => {
    //   if (child.dispose) child.dispose();
    // });
  }
}
