import { Scene as S } from "three";
import { Gl } from "./gl";
import { Quad } from "./quad";
import { Instance } from "./instance";
import { loadAssets } from "./utils/loader";
import { Model } from "./model";
import { GpuInstance } from "./gpuInstance";
import { setWebgl } from "~/lib/stores/webglStore";

// import { Node } from "./quadNode";

// (*) test and setup loader

export class Scene extends S {
  constructor() {
    super();

    // this.load();
  }

  async load() {
    console.time("webgl:load");
    this.assets = await loadAssets();
    console.log("::", this.assets);
    console.timeEnd("webgl:load");

    setWebgl({ loaded: true });

    this.create();
  }

  create() {
    // this.model = new Model(this.assets.suzanne);
    // this.add(this.model);
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
