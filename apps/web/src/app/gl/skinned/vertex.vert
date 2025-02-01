#include '../../glsl/constants.glsl'
#include <skinning_pars_vertex>

uniform float u_time;
varying vec2 v_uv;
varying vec3 v_normal;


void main() {
  #include <skinbase_vertex>
  // vec3 pos = position;

  vec4 tr = modelViewMatrix * vec4(position, 1.0);
  v_uv = uv;

  #include <begin_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
  #include <worldpos_vertex>
  
  v_normal = normalize(normalMatrix * normal);
}
