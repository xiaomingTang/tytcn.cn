import React, {
  forwardRef,
} from "react"
import {
  useLoader,
} from "react-three-fiber"

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"

import { useAnimation, useMap, useShadow } from "./effects"
import { AssetProps } from "./types"
import { Object3DLabel } from "./Label"

function RawFBXAssets({
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
  const model = useLoader(FBXLoader, url, undefined, onProgress)

  useMap(model, maps)

  useShadow(model, shadow)

  useAnimation(model, model.animations, activeAnimationIndex)

  return <primitive {...props} object={model} ref={ref}>
    {children}
    {
      label && <Object3DLabel target={model} dir="+Y">
        {label}
      </Object3DLabel>
    }
  </primitive>
}

export const FBXAssets = forwardRef(RawFBXAssets)
