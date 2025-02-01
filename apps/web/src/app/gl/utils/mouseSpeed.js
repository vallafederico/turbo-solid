// (*) fix NaN when HMR
export function useMouseSpeed() {
  let mouseSpeed = 0;
  let lastMousePosition = { x: 0, y: 0 };
  let lastMoveTimestamp = 0;

  const calculateMouseSpeed = (e) => {
    let currentTime = performance.now();
    let currentPosition = { x: e.clientX, y: e.clientY };

    if (lastMoveTimestamp) {
      const deltaTime = (currentTime - lastMoveTimestamp) / 1000;
      const distance = Math.hypot(
        currentPosition.x - lastMousePosition.x,
        currentPosition.y - lastMousePosition.y,
      );

      mouseSpeed = Math.min(distance / deltaTime / 1000, 1); // limit to .5
    }

    lastMousePosition = currentPosition;
    lastMoveTimestamp = currentTime;

    // console.log({ mouseSpeed });
    if (isNaN(mouseSpeed)) {
      mouseSpeed = 0;
    }

    return mouseSpeed;
  };

  return { calculateMouseSpeed };
}
