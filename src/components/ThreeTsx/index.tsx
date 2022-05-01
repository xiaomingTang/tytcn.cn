import { extend } from "react-three-fiber"
import type { Object3DNode } from "react-three-fiber"
import { DirectionalLightShadow } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import SpriteText from "three-spritetext"

extend({
  OrbitControls,
  DirectionalLightShadow,
  EffectComposer,
  RenderPass,
  OutlinePass,
  ShaderPass,
  SpriteText,
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line no-undef
      orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>;
      // eslint-disable-next-line no-undef
      effectComposer: Object3DNode<EffectComposer, typeof EffectComposer>;
      // eslint-disable-next-line no-undef
      renderPass: Object3DNode<RenderPass, typeof RenderPass>;
      // eslint-disable-next-line no-undef
      outlinePass: Object3DNode<OutlinePass, typeof OutlinePass>;
      // eslint-disable-next-line no-undef
      shaderPass: Object3DNode<ShaderPass, typeof ShaderPass>;
      // eslint-disable-next-line no-undef
      spriteText: Object3DNode<SpriteText, typeof SpriteText>;
    }
  }
}
