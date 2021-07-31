import * as THREE from 'three'

export function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh
}

export function isLight(obj: THREE.Object3D): obj is THREE.Light {
  return (obj as THREE.Light).isLight
}

export function traverseMaterial(obj: THREE.Object3D, callback: (mat: THREE.Material) => void): void {
  obj.traverse((child) => {
    if (isMesh(child)) {
      const { material } = child
      const mats = Array.isArray(material) ? material : [material]
      mats.forEach(callback)
    }
  })
}

export function scaleObjectTo(object3d: THREE.Object3D, size: number): void {
  const box = new THREE.Box3().setFromObject(object3d)
  const delta = new THREE.Vector3().subVectors(box.max, box.min)

  const scalar = size / Math.max(...delta.toArray())
  object3d.scale.multiplyScalar(scalar)
}

export function moveObjectTo(object3d: THREE.Object3D, target: THREE.Vector3, base: 'TOP' | 'BOTTOM' | 'CENTER' = 'BOTTOM'): void {
  const box = new THREE.Box3().setFromObject(object3d)
  const halfDeltaY = (box.max.y - box.min.y) / 2
  const center = box.getCenter(new THREE.Vector3())

  if (base === 'BOTTOM') {
    center.y -= halfDeltaY
  } else if (base === 'TOP') {
    center.y += halfDeltaY
  }

  center.y -= 0.0001

  object3d.position.addVectors(object3d.position.clone(), new THREE.Vector3().subVectors(target, center))
}
