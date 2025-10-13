precision mediump float;
#include '../glsl/colors.glsl'

uniform float u_time;

varying vec2 v_uv;
varying vec3 v_normal;

// #include '../glsl/fresnel.glsl'


void main() {


  gl_FragColor.rgb = vec3(v_uv, 1.);
  gl_FragColor.a = 1.;
  // gl_FragColor = vec4(1., 0., 0., 1.);
}
