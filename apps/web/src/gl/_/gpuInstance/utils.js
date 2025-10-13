import { InstancedBufferAttribute } from "three";

// * uvs
export function calculateUvs(WIDTH) {
  const uvs = new Float32Array(WIDTH * WIDTH * 2);
  let index = 0;
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < WIDTH; j++) {
      uvs[index] = i / (WIDTH - 1);
      uvs[index + 1] = j / (WIDTH - 1);
      index += 2;
    }
  }

  return uvs;
}

export function setUvs(geometry, WIDTH) {
  const uvs = calculateUvs(WIDTH);
  geometry.setAttribute("a_uv", new InstancedBufferAttribute(uvs, 2));
}

// * random position
export function calculateRandomPosition(texture, spread = 1.5) {
  const data = texture.image.data;

  for (let k = 0, kl = data.length; k < kl; k += 4) {
    data[k + 0] = Math.random() * spread - spread / 2;
    data[k + 1] = Math.random() * spread - spread / 2;
    data[k + 2] = Math.random() * spread - spread / 2;
    data[k + 3] = Math.random();
  }
}
