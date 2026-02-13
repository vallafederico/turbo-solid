#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_previous;

const float DECAY = .99;
const float SPEED_MULT = .5;

// Simplex noise function
vec3 permute(vec3 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
            -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                    dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // Sample the previous state
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

    // Diffusion rate
    float diffusionRate = 0.03;

    // Subtle noise based on time (significantly reduced intensity)
    float noiseValue = snoise(uv * 3.0 + u_time * 0.05) * 0.01;

    // Mouse interaction with dynamic size based on speed
    vec2 mousePos = u_mouse.xy * .5 + .5;
    float mouseSpeed = u_mouse.z * SPEED_MULT;
    float interactionSize = mix(0.01, 0.2, mouseSpeed); // Adjust these values as needed
    float mouseInfluence = smoothstep(interactionSize, 0.0, length(uv - mousePos)) * 0.5;
    vec4 mouseColor = vec4(1.0, 0.5, 0.0, 1.0); // Orange color for mouse interaction

    // Combine everything
    vec4 diffusedState = mix(previousState, average, diffusionRate);
    vec4 finalState = diffusedState + noiseValue * diffusedState + mouseInfluence * mouseColor * (mouseSpeed + 0.1);

    // Add a very subtle overall flow
    finalState += vec4(snoise(uv * 1.5 + u_time * 0.01) * 0.002);

    // Decay
    finalState *= DECAY;

    // Ensure the values stay within a valid range
    finalState = clamp(finalState, 0.0, 1.0);
    gl_FragColor = vec4(finalState.rrr, 1.0);
}
