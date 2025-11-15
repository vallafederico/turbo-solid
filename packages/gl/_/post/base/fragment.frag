uniform float opacity;
uniform sampler2D tDiffuse;
uniform sampler2D u_screen;
uniform float u_time;

varying vec2 vUv;

void main() {

    vec3 diff = texture2D(tDiffuse, vUv).rgb;    

    gl_FragColor.rgb = diff.rgb;
    gl_FragColor.a = 1.;


}

/** post */
// gl_FragColor.rgb = ACESFilmicToneMapping(diff.rgb);
// gl_FragColor = linearToOutputTexel(gl_FragColor);