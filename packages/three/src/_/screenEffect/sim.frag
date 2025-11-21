#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_previous;

// <<< PARAMS
const float DECAY = .99; // .99
const float SPEED_MULT = .5; // .5
const float NOISE_POW = 0.03; // 0.02
const float MAIN_FLOW = 0.0; // 0.005
const float DIFFUSION_RATE = 0.03; // .03
const vec2 INTERACTION_SIZE = vec2(0.01, 0.3); // 0.05, 0.2
const vec4 MOUSE_COLOR = vec4(1.0, 0., 0.0, 1.0); // 1.0, 0., 0.0, 1.0

#include "../../glsl/simplex.glsl"

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 previousState = texture2D(u_previous, uv);

    // Improved diffusion using multiple samples
    vec4 sum = vec4(0.0);
    float weight = 0.0;
    for (float i = -2.0; i <= 2.0; i++) {
        for (float j = -2.0; j <= 2.0; j++) {
            vec2 offset = vec2(i, j) / resolution.xy;
            float w = 1.0 / (length(offset) + 1.0);
            sum += texture2D(u_previous, uv + offset) * w;
            weight += w;
        }
    }

    vec4 average = sum / weight;
    float noiseValue = snoise(uv * 3.0 + u_time * 0.05) * NOISE_POW;

    // * mouse
    vec2 mousePos = u_mouse.xy * .5 + .5;
    float mouseSpeed = u_mouse.z * SPEED_MULT;
    float interactionSize = mix(INTERACTION_SIZE.x, INTERACTION_SIZE.y, mouseSpeed); // Adjust these values as needed
    float mouseInfluence = smoothstep(interactionSize, 0.0, length(uv - mousePos)) * 0.5;

    // * all
    vec4 diffusedState = mix(previousState, average, DIFFUSION_RATE);
    vec4 finalState = diffusedState + noiseValue * diffusedState + mouseInfluence * MOUSE_COLOR * (mouseSpeed + 0.1);

    finalState += vec4(snoise(uv * 1.5 + u_time * 0.01) * MAIN_FLOW);
    finalState *= DECAY;
    finalState = clamp(finalState, 0.0, 1.0);

    gl_FragColor = vec4(finalState.rgb, 1.0);
}
