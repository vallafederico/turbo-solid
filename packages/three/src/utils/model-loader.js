import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const loader = new GLTFLoader();

export default (url, id) => {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      gltf.scene.traverse((child) => {
        // skinned mesh auto assign
        if (child.isSkinnedMesh && gltf.animations.length) {
          child.parent.animations = gltf.animations;
        }
      });

      const result = gltf.scene;
      resolve(result);
    });
  });
};
