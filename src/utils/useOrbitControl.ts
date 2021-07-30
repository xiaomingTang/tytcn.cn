import {
  useEffect, useState,
} from "react"
import { useFrame, useThree } from "react-three-fiber"
import { Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import TWEEN from "@tweenjs/tween.js"
import { voidFunc } from "./others"

const globalOrbitControlMap: {
  [key in string]?: OrbitControls;
} = {}

export function useOrbitControl(name = "_useOrbitControl_defaultName_") {
  const [targetMap, setTargetMap] = useState({
    tween: false,
    target: new Vector3(),
  })

  const {
    camera,
    gl: { domElement },
  } = useThree()

  useEffect(() => {
    const oldControl = globalOrbitControlMap[name]
    if (oldControl) {
      oldControl.dispose()
    }

    const newControl = new OrbitControls(camera, domElement)
    // 根据本人喜好提供默认设置, 不喜欢的自己重置
    newControl.enableDamping = true
    newControl.dampingFactor = 0.1
    globalOrbitControlMap[name] = newControl

    return () => {
      const prevControl = globalOrbitControlMap[name]
      if (prevControl) {
        prevControl.dispose()
        globalOrbitControlMap[name] = undefined
      }
    }
  }, [camera, domElement, name])

  // tween target
  useEffect(() => {
    const oldControl = globalOrbitControlMap[name]
    if (!oldControl) {
      return voidFunc
    }
    if (targetMap.tween) {
      const tween = new TWEEN.Tween(oldControl)
        .to({
          target: targetMap.target,
        }, 500)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .start()
      return () => {
        if (tween) {
          tween.stop()
        }
      }
    }
    return voidFunc
  }, [name, targetMap])

  // update
  useFrame(() => {
    const oldControl = globalOrbitControlMap[name]
    if (oldControl) {
      oldControl.update()
    }
    TWEEN.update()
  })

  return {
    orbitControl: globalOrbitControlMap[name],
    setTargetMap,
  }
}
