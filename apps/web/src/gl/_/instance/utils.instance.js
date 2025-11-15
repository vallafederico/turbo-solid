// --- utils
export function getRandomData(num = 10, amount = 4) {
  const data = new Float32Array(num * amount);
  for (let i = 0; i < num * amount; i++) {
    data[i + 0] = Math.random() * 2 - 1;
    data[i + 1] = Math.random() * 2 - 1;
    data[i + 2] = Math.random() * 2 - 1;
    data[i + 3] = Math.random();
  }
  return data;
}
