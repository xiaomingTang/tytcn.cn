import { isLight, isMesh, traverseMaterial } from "@Src/utils/threeUtils"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

export function useAnimation(object3d: THREE.Object3D | undefined | null, animations: THREE.AnimationClip[] | undefined | null, activeIndex = -1) {
  const mixer = useMemo(() => {
    if (object3d) {
      return new THREE.AnimationMixer(object3d)
    }
    return null
  }, [object3d])

  const prevActionRef = useRef<THREE.AnimationAction | undefined>()

  const actions: THREE.AnimationAction[] = useMemo(() => {
    if (animations && mixer) {
      return animations.map((animation) => mixer.clipAction(animation))
    }
    return []
  }, [animations, mixer])

  useEffect(() => {
    const prevAction = prevActionRef.current
    const nextAction = actions[activeIndex]

    if (prevAction) {
      prevAction.fadeOut(1)
    }

    if (nextAction) {
      nextAction.reset()
      nextAction.fadeIn(1)
      nextAction.play()
    }

    prevActionRef.current = nextAction

    return () => {
      if (prevAction) {
        prevAction.stop()
      }

      if (nextAction) {
        nextAction.stop()
      }
    }
  }, [actions, activeIndex])

  const rafFlagRef = useRef(-1)
  // 时钟不能放外面, 放外面会导致出错, 因为共用 running 及 oldTime 等, 会导致 diff 始终为 0
  const clockRef = useRef(new THREE.Clock())

  // 更新动作
  useEffect(() => {
    const update = () => {
      if (mixer) {
        mixer.update(clockRef.current.getDelta())
        rafFlagRef.current = window.requestAnimationFrame(update)
      }
    }
    rafFlagRef.current = window.requestAnimationFrame(update)

    return () => {
      window.cancelAnimationFrame(rafFlagRef.current)
      rafFlagRef.current = -1
    }
  }, [mixer])
}

interface OptionalMaps {
  map?: string;
  aoMap?: string;
  normalMap?: string;
}

const globalTextureLoader = new THREE.TextureLoader()

export function useMap(object3d?: THREE.Object3D, maps: OptionalMaps = {}) {
  // 更新贴图
  useEffect(() => {
    if (object3d && maps && (maps.map || maps.aoMap || maps.normalMap)) {
      traverseMaterial(object3d, (mat) => {
        const meshStandardMaterial = mat as THREE.MeshStandardMaterial
        if (maps.map) {
          meshStandardMaterial.map = globalTextureLoader.load(maps.map)
        }
        if (maps.aoMap) {
          meshStandardMaterial.aoMap = globalTextureLoader.load(maps.aoMap)
        }
        if (maps.normalMap) {
          meshStandardMaterial.normalMap = globalTextureLoader.load(maps.normalMap)
        }
      })
    }
  }, [object3d, maps])
}

export function useShadow(object3d?: THREE.Object3D, shadow = true) {
  // 处理阴影
  useEffect(() => {
    /* eslint-disable no-param-reassign */
    if (object3d) {
      object3d.traverse((child) => {
        if (isLight(child)) {
          child.castShadow = shadow
        }
        if (isMesh(child)) {
          // 设置模型生成阴影并接收阴影
          child.castShadow = shadow
          child.receiveShadow = shadow
        }
      })
    }
    /* eslint-enable no-param-reassign */
  }, [object3d, shadow])
}
