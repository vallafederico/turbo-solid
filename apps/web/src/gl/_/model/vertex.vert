// precision mediump float;
#include '../../glsl/constants.glsl'

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float u_time;
varying vec2 v_uv;
varying vec3 v_normal;


void main() {
  vec3 pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  v_uv = uv;

  v_normal = normalize(normalMatrix * normal);
}
