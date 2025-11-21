import { Scene as S } from "three";
import { loadAssets } from "./utils/loader";
// setWebgl should be passed in or made optional
// import { setWebgl } from "~/lib/stores/webglStore";
// import { Gl } from "./gl";

// import { Quad } from "./_/quad";
// import { Instance } from "./_/instance";
// import { Model } from "./_/model";
// import { Gpuinstance } from "./_/gpuInstance";

export class Scene extends S {
  constructor(assets) {
    super();

    this.load(assets);
  }

  async load(assets) {
    console.time("webgl:load");
    this.assets = await loadAssets(assets);
    console.log("::", this.assets);
    console.timeEnd("webgl:load");

    // setWebgl({ loaded: true });

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
