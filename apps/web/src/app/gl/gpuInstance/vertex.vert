#include '../glsl/constants.glsl'
// precision mediump float;

attribute vec3 position;
attribute vec2 uv;
attribute vec2 a_uv;
attribute vec4 a_position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
varying vec2 v_uv;
varying vec3 v_normal;

uniform sampler2D u_position_texture;


void main() {
  float r_time = u_time * 0.1;

  vec4 sim = texture2D(u_position_texture, a_uv);

  vec3 pos = position;
  pos += sim.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  v_uv = uv;
  v_normal = normal;
}


/*
  vec4 m_pos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1000. * (1. / -m_pos.z);
  gl_Position = projectionMatrix * m_pos;
*/