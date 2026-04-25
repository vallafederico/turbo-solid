/**
 * Recursively dispose every Mesh / SkinnedMesh / InstancedMesh under `root`,
 * then detach `root` from its parent. Disposes:
 *  - geometry
 *  - material(s) and any direct texture properties on them (.map, .normalMap, ...)
 *
 * NOTE: Uniform textures (e.g. `u_screen` / `u_previous`) are NOT freed here
 * because they're typically owned by another class (Post, GPUComputationRenderer).
 * Each owner should release those explicitly in its own dispose().
 *
 * @param {import("three").Object3D | null | undefined} root
 */
export function disposeObject3D(root) {
  if (!root) return;
  root.traverse((obj) => {
    if (obj.isMesh || obj.isSkinnedMesh || obj.isInstancedMesh) {
      obj.geometry?.dispose?.();
      const mat = obj.material;
      if (Array.isArray(mat)) {
        for (const m of mat) disposeMaterial(m);
      } else {
        disposeMaterial(mat);
      }
    }
  });
  root.parent?.remove?.(root);
}

/** @param {any} mat */
function disposeMaterial(mat) {
  if (!mat) return;
  for (const key of Object.keys(mat)) {
    const value = mat[key];
    if (value && value.isTexture && typeof value.dispose === "function") {
      value.dispose();
    }
  }
  mat.dispose?.();
}

/**
 * Recursively walk an arbitrary asset map (the output of `loadAssets`) and
 * dispose anything that looks like a Texture or an Object3D scene graph.
 *
 * @param {unknown} assets
 */
export function disposeAssets(assets) {
  if (!assets || typeof assets !== "object") return;
  const item = /** @type {any} */ (assets);
  if (item.isTexture && typeof item.dispose === "function") {
    item.dispose();
    return;
  }
  if (item.isObject3D) {
    disposeObject3D(/** @type {import("three").Object3D} */ (item));
    return;
  }
  for (const key of Object.keys(assets)) {
    disposeAssets(item[key]);
  }
}
