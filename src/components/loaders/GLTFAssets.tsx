import React, {
  forwardRef,
} from "react"
import {
  useLoader, useThree,
} from "react-three-fiber"
import * as THREE from "three"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader"
// @ts-ignore
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module"

import { useAnimation, useMap, useShadow } from "./effects"
import { AssetProps } from "./types"
import { Object3DLabel } from "./Label"

function RawGLTFAssets({
  url,
  label,
  shadow = false,
  activeAnimationIndex = -1,
  maps,
  onProgress,
  children,
  ...props
}: AssetProps, ref?: React.Ref<THREE.Group>) {
  // 加载模型
  const { gl } = useThree()

  // 加载 glb
  const glb = useLoader(GLTFLoader, url, (loader) => {
    (loader as GLTFLoader)
      .setDRACOLoader(
        new DRACOLoader()
          .setDecoderPath("static-assets/wasm/"),
      )
      .setKTX2Loader(
        new KTX2Loader()
          .setTranscoderPath("static-assets/wasm/")
          .detectSupport(gl),
      )
      .setMeshoptDecoder(MeshoptDecoder)
  }, onProgress)

  useMap(glb.scene, maps)

  useShadow(glb.scene, shadow)

  useAnimation(glb.scene, glb.animations, activeAnimationIndex)

  return <primitive {...props} object={glb.scene} ref={ref}>
    {children}
    {
      label && <Object3DLabel target={glb.scene} dir="-Z">
        {label}
      </Object3DLabel>
    }
  </primitive>
}

export const GLTFAssets = forwardRef(RawGLTFAssets)
