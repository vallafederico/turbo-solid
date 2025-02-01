import loadModel from "./model-loader";
import loadTexture from "./texture-loader";
import { assets as file } from "../assets";

export async function loadAssets(opt = null) {
  console.time("assets::");
  const assets = opt || file;
  const promises = [];
  const names = [];

  function processAsset(asset, key) {
    if (typeof asset === "string") {
      const extension = asset.split(".").pop().toLowerCase();
      if (["glb", "gltf"].includes(extension)) {
        promises.push(loadModel(asset));
        names.push(key);
      } else if (["jpg", "png", "webp", "jpeg"].includes(extension)) {
        promises.push(loadTexture(asset));
        names.push(key);
      }
    } else if (typeof asset === "object" && asset !== null) {
      for (const nestedKey in asset) {
        processAsset(asset[nestedKey], `${key}.${nestedKey}`);
      }
    }
  }

  for (const key in assets) {
    processAsset(assets[key], key);
  }

  const loaded = await Promise.all(promises);
  const result = names.reduce((acc, key, index) => {
    const keys = key.split(".");
    let current = acc;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = loaded[index];
    return acc;
  }, {});

  console.timeEnd("assets::");
  return result;
}
