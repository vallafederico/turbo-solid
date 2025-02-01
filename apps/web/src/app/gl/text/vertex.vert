// // precision mediump float;
// #include '../glsl/constants.glsl'

// attribute vec3 position;
// attribute vec2 uv;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

// uniform float u_time;
// varying vec2 v_uv;


// void main() {
//   vec3 pos = position;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   v_uv = uv;
// }


    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }