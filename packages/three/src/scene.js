import { Scene as S } from "three";
import { assets, setWebgl } from "@local/gl-context";
import { loadAssets } from "./utils/loader";
import { Model } from "./_/model";
import { disposeAssets, disposeObject3D } from "./utils/dispose";

export class Scene extends S {
  constructor() {
    super();

    this.load();
  }

  async load() {
    console.time("webgl:load");
    this.assets = await loadAssets(assets);
    console.timeEnd("webgl:load");

    if (setWebgl) setWebgl({ loaded: true });

    this.create();
  }

  create() {
    this.suzanne = new Model(this.assets.suzanne);
  }

  render() {}

  resize() {}

  onScroll(scroll) {}

  dispose() {
    this.suzanne?.dispose?.();
    this.suzanne = null;

    // Dispose anything still hanging off this Scene (children added via createWebGlNode, etc.)
    for (const child of [...this.children]) {
      disposeObject3D(child);
    }

    // Free GPU memory for the original loaded glTF / textures.
    disposeAssets(this.assets);
    this.assets = null;
  }
}
