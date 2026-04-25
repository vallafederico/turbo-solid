import { Scene as S } from "three";
import { assets, setWebgl } from "@local/gl-context";
import { loadAssets } from "./utils/loader";
import { Model } from "./_/model";
import { disposeAssets, disposeObject3D } from "./utils/dispose";

export class Scene extends S {
  constructor({ isActive = () => true } = {}) {
    super();

    this.isActive = isActive;
    this.disposed = false;
    this.load();
  }

  async load() {
    const loadedAssets = await loadAssets(assets);

    if (this.disposed || !this.isActive()) {
      disposeAssets(loadedAssets);
      return;
    }

    this.assets = loadedAssets;

    if (setWebgl) setWebgl({ loaded: true });

    this.create();
  }

  create() {
    if (this.disposed || !this.assets?.suzanne) return;
    this.suzanne = new Model(this.assets.suzanne);
  }

  render() {}

  resize() {}

  onScroll(scroll) {}

  dispose() {
    this.disposed = true;

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
