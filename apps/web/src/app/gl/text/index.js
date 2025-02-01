// https://protectwise.github.io/troika/troika-three-text/

import { Color, Mesh, PlaneGeometry, ShaderMaterial, DoubleSide } from "three";
import { Text as TroikaText } from "troika-three-text";
import { createDerivedMaterial } from "troika-three-utils";

import vertexShader from "./vertex.vert";
import fragmentShader from "./fragment.frag";

// (*) find a way to use with shader / use derived material

export class Text extends TroikaText {
  fontSize = 0.1;
  maxWidth = 1;
  font = "/fonts/Sohne-Buch-webh.woff";
  anchorX = "center";
  anchorY = "middle";

  text =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  // material = new Material();

  constructor() {
    super();
    this.sync(() => {
      // if (this.textRenderInfo && this.textRenderInfo.sdfTexture) {
      //   this.material.uniforms.uTexture.value = this.textRenderInfo.sdfTexture;
      // }
    });

    // console.log(this.material);
  }

  render(t) {
    // console.log(t);
  }
}

class Material extends ShaderMaterial {
  constructor(options) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
        uColor: { value: new Color(0xffffff) },
        uOpacity: { value: 1.0 },
        uThreshold: { value: 0.5 },
        uSmoothing: { value: 0.01 },
      },
      side: DoubleSide,
      wireframe: false,
      transparent: true,
    });
  }

  set time(t) {
    this.uniforms.u_time.value = t;
  }
}
