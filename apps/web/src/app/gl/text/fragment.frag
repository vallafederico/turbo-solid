// precision mediump float;
// #include '../glsl/colors.glsl'

// uniform float u_time;
// // uniform sampler2D u_t1; vec4 img = texture2D(u_t1, v_uv);

// varying vec2 v_uv;


// void main() {

//   gl_FragColor.rgb = vec3(v_uv, 0.);
//   gl_FragColor.a = 1.;
  
// }

    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uThreshold;
    uniform float uSmoothing;
    varying vec2 vUv;

    void main() {
      // Sample the SDF texture
      vec4 textureSample = texture2D(uTexture, vUv);
      float sdf = textureSample.a;
      
      // Debug: Visualize all channels of the texture
      gl_FragColor = textureSample;
      
      // Uncomment to see only the alpha channel (SDF data)
      // gl_FragColor = vec4(sdf, sdf, sdf, 1.0);
      
      // Original SDF rendering logic
      // float alpha = smoothstep(uThreshold - uSmoothing, uThreshold + uSmoothing, sdf);
      // gl_FragColor = vec4(uColor, alpha * uOpacity);
    }