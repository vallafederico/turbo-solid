precision mediump float;

uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_texture;
uniform sampler2D u_previous;

varying vec2 v_uv;

void main() {
    // vec2 mouse = u_mouse.xy * .5 + vec2(.5);

    vec3 position = texture2D(u_texture, v_uv).rgb;

    gl_FragColor.rgb = position.rgb;
    gl_FragColor.a = 1.;
}
