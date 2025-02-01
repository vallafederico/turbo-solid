precision mediump float;

uniform float u_time;
uniform vec3 u_mouse;
// uniform sampler2D u_texture;
uniform sampler2D u_original;

// varying vec2 v_uv;

const float FORCE_ATT = 5.; // 5
const float FORCE_POW = .2; // .2
const float BACK_ATT = .09; // .05

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 original = texture2D(u_original, uv);
    vec4 position = texture2D(u_texture, uv);

    vec3 force = original.xyz - u_mouse.xyz;
    float len = length(force);
    float fac = 1. / max(1., len * FORCE_ATT);

    vec3 positionToGo = original.xyz + normalize(force) * fac * FORCE_POW; 
    position.xyz += (positionToGo.xyz - position.xyz) * BACK_ATT;

    // position.x += .01;

    
    gl_FragColor.rgb = vec3(position.xyz);
    gl_FragColor.a = position.w;
  
}


