/* eslint-disable no-param-reassign */
import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from "react"
import * as THREE from "three"
import {
  Canvas, ContainerProps, useFrame, useThree,
} from "react-three-fiber"
import FPSStats from "react-fps-stats"
import { ProgressProvider, RawProgressContext } from "ease-progress"
import { useDeviceOrientation } from "xiaoming-hooks"

import "@Src/components/ThreeTsx"
import { useOrbitControl } from "@Src/utils/useOrbitControl"
import { CatchableSuspense } from "@Src/components/CatchableSuspense"
import { EnvMap } from "@Src/components/EnvMap"
import { SimulateClick } from "@Src/components/SimulateEvents"
import { GLTFAssets } from "@Src/components/loaders/GLTFAssets"
import { moveObjectTo, scaleObjectTo } from "@Src/utils/threeUtils"
import { Loading } from "@Src/components/Fallback"
import { Continent } from "@Src/components/Continent"
import { MapControls } from "@react-three/drei"

const MODEL_SIZE = 10

const canvasConfig: Omit<ContainerProps, "children"> = {
  shadowMap: false,
  gl: {
    antialias: true,
  },
  colorManagement: true,
  orthographic: true,
  camera: {
    // 相机的默认位置是 (0, 0, 5), lookAt (0, 0, 0)
    position: [
      0,
      2 / Math.sqrt(3),
      // 0,
      Math.sqrt(3),
    ].map((i) => i * MODEL_SIZE * 0.5) as [number, number, number],
    zoom: 50,
    left: -MODEL_SIZE,
    right: MODEL_SIZE,
    top: MODEL_SIZE,
    bottom: -MODEL_SIZE,
    near: -MODEL_SIZE * 5,
    far: MODEL_SIZE * 5,
  },
  onCreated: ({ scene }) => {
    scene.background = new THREE.Color(0xcccccc)
    // scene.fog = new THREE.Fog(0xcccccc, MODEL_SIZE * 2, MODEL_SIZE * 4)
  },
}

function Delay<T>({ ms, children }: { ms: number; children: T }): T | null {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const flag = window.setTimeout(() => {
      setVisible(true)
    }, ms)

    return () => {
      window.clearTimeout(flag)
      setVisible(false)
    }
  }, [ms])

  return visible ? children : null
}

function Envs() {
  return <>
    <axesHelper args={[MODEL_SIZE * 1.5]} />
    {/* <gridHelper args={[MODEL_SIZE * 1.5, MODEL_SIZE * 1.5, "red", "blue"]} /> */}

    <CatchableSuspense>
      <EnvMap url="static/images/box.jpg" />
      {/* <EnvMap url="static-assets/envs/royal_esplanade_1k.hdr" /> */}
      {/* <EnvMap url={[[
        "static-assets/images/box.jpg",
        "static-assets/images/box.jpg",
        "static-assets/images/box.jpg",
        "static-assets/images/box.jpg",
        "static-assets/images/box.jpg",
        "static-assets/images/box.jpg",
      ]]} /> */}
    </CatchableSuspense>

    <ambientLight
      args={["white", 0.1]}
    />

    <directionalLight
      args={["white", 0.2]}
      position={[10, 10, 10]}
    />

    <pointLight
      args={["white", 0.2]}
      position={[-10, 10, -10]}
    />
  </>
}

function Scene() {
  // const { setTargetMap } = useOrbitControl()
  const { setProgressState } = useContext(RawProgressContext)
  const modelInfo = useMemo(() => ({
    url: "static/models/Apple.glb",
    label: "苹果",
  }), [])

  const [model, setModel] = useState<THREE.Group>()
  const orientation = useDeviceOrientation()

  useEffect(() => {
    if (model) {
      // const size = Math.ceil(Math.sqrt(modelsWithMap.length))
      // const x = Math.floor(idx / size)
      // const z = idx % size
      // const vx = (x + 0.5 - size / 2) * (200 / size)
      // const vz = (z + 0.5 - size / 2) * (200 / size)
      // scaleObjectTo(obj, 20)
      // moveObjectTo(obj, new THREE.Vector3(vx, 0, vz), "BOTTOM")
      scaleObjectTo(model, MODEL_SIZE)
      moveObjectTo(model, new THREE.Vector3(), "BOTTOM")
    }
    return () => {
      if (model) {
        model.scale.set(1, 1, 1)
        model.position.set(0, 0, 0)
      }
    }
  }, [model])

  useEffect(() => {
    if (model) {
      model.rotation.set(
        THREE.MathUtils.degToRad(orientation.beta),
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(-orientation.gamma),
      )
    }
    return () => {
      if (model) {
        model.rotation.set(0, 0, 0)
      }
    }
  }, [orientation, model])

  return <>
    <Envs />
    <>
      {
      /*
      <CatchableSuspense>
        <SimulateClick alwaysSimulate={true}>
          <GLTFAssets
            url={modelInfo.url}
            key={modelInfo.url}
            shadow={true}
            activeAnimationIndex={3}
            ref={(obj) => {
              if (obj) {
                setModel(obj)
              }
            }}
            onProgress={(e) => {
              setProgressState({
                [modelInfo.url]: {
                  loaded: e.loaded,
                  total: e.total,
                },
              })
            }}
            onClick={(e) => {
              e.stopPropagation()
              const target = new THREE.Box3().setFromObject(e.object).getCenter(new THREE.Vector3())
              setTargetMap({
                tween: true,
                target,
              })
            }}
          />
        </SimulateClick>
      </CatchableSuspense>
      */
      }
    </>
    <MapControls
      enableDamping={false}
      enableRotate={!("ontouchstart" in document.documentElement)}
      // minPolarAngle={Math.PI / 3}
      // maxPolarAngle={Math.PI / 3}
      // minAzimuthAngle={Math.PI / 6}
      // maxAzimuthAngle={Math.PI / 6}
    />
    <Continent />
  </>
}

function RawDevice() {
  const progressContext = useContext(RawProgressContext)
  const { loaded, total } = progressContext

  return <>
    {/* 此处延迟, 是因为 Canvas 组件会中断 css 动画(如果页面切换有动画) */}
    <Delay ms={500}>
      <Canvas
        {...canvasConfig}
      >
        <RawProgressContext.Provider value={progressContext}>
          <Scene />
        </RawProgressContext.Provider>
      </Canvas>
    </Delay>
    <FPSStats />
    {loaded < total && <Loading
      text={`${(loaded / 1024 / 1024).toFixed(1)}MB / ${(total / 1024 / 1024).toFixed(1)}MB`}
    />}
    <div style={{
      position: "fixed",
      bottom: "64px",
      left: "50%",
      width: "64px",
      height: "64px",
      transform: "translateX(-50%)",
      backgroundColor: "rgba(0, 0, 0, .5)",
      zIndex: 100,
      pointerEvents: "none",
    }}></div>
  </>
}

function Device() {
  return <ProgressProvider>
    <RawDevice />
  </ProgressProvider>
}

export default Device
