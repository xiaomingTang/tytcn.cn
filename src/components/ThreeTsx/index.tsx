import { extend, Object3DNode } from "react-three-fiber"
import { DirectionalLightShadow } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

extend({
  OrbitControls,
  DirectionalLightShadow,
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line no-undef
      orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>;
    }
  }
}
