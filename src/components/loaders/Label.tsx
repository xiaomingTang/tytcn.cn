import React, { useMemo } from "react"
import { Html } from "@react-three/drei"
import * as THREE from "three"

import { joinSpace } from "@Src/utils/others"

import Styles from "./Label.module.less"

type Dir = "+X" | "+Y" | "+Z" | "-X" | "-Y" | "-Z" | "CENTER"

function getLabelPosition(object3d: THREE.Object3D, dir: Dir = "+Y") {
  const box = new THREE.Box3().setFromObject(object3d)
  const center = box.getCenter(new THREE.Vector3())
  const halfX = (box.max.x - box.min.x) / 2
  const halfY = (box.max.y - box.min.y) / 2
  const halfZ = (box.max.z - box.min.z) / 2

  switch (dir) {
  case "+X":
    center.x += halfX
    break
  case "+Y":
    center.y += halfY
    break
  case "+Z":
    center.z += halfZ
    break
  case "-X":
    center.x -= halfX
    break
  case "-Y":
    center.y -= halfY
    break
  case "-Z":
    center.z -= halfZ
    break
  default:
    break
  }
  return center.clone()
}

const dirClassNameMap: Record<Dir, string> = {
  "+X": Styles.posX,
  "+Y": Styles.posY,
  "+Z": Styles.posZ,
  "-X": Styles.negX,
  "-Y": Styles.negY,
  "-Z": Styles.negZ,
  CENTER: "",
}

interface LabelProps {
  dir?: Dir;
  children: React.ReactNode;
}

interface Object3DLabelProps extends LabelProps {
  target: THREE.Object3D;
}

export function Object3DLabel({
  target, dir = "+Y", children,
}: Object3DLabelProps) {
  const labelPosition = useMemo(() => getLabelPosition(target, dir), [target, dir])

  return <mesh position={labelPosition}>
    <planeBufferGeometry args={[0, 0]} />
    <meshBasicMaterial side={THREE.DoubleSide} />
    <Html className={joinSpace(Styles.label, dirClassNameMap[dir])}>
      {children}
    </Html>
  </mesh>
}
