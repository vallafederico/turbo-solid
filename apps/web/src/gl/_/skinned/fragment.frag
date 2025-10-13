#include '../../glsl/colors.glsl'

uniform float u_time;
uniform sampler2D u_diff; 

varying vec2 v_uv;
varying vec3 v_normal;


void main() {

  gl_FragColor.rgb = vec3(v_uv, 1.);
  gl_FragColor.a = 1.;
  
}
