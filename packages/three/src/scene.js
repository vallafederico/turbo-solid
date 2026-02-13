import { Scene as S } from "three";
import { assets, setWebgl } from "@local/gl-context";
import { loadAssets } from "./utils/loader";
import { Model } from "./_/model";

export class Scene extends S {
  constructor() {
    super();

    this.load();
  }

  async load() {
    console.time("webgl:load");
    this.assets = await loadAssets(assets);
    console.log("::", this.assets);
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

  dispose() {}
}
