import { useEffect, useState } from "react"
import { throttle } from "throttle-debounce"

interface Orientation {
  absolute: boolean;
  alpha: number;
  beta: number;
  gamma: number;
}

const defaultOrientation: Orientation = {
  absolute: false,
  alpha: 0,
  beta: 0,
  gamma: 0,
}

let initialOffset: number | null = null

export function useOrientation(throttleTimeMs = 200): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(defaultOrientation)

  useEffect(() => {
    const onOrientationChange = throttle(throttleTimeMs, (e: DeviceOrientationEvent) => {
      if (initialOffset === null) {
        if (
          e.absolute !== true
          // @ts-ignore
          && +e.webkitCompassAccuracy > 0
          // @ts-ignore
          && +e.webkitCompassAccuracy < 50
        ) {
          // @ts-ignore
          initialOffset = e.webkitCompassHeading || 0
        } else {
          initialOffset = e.alpha
        }
      }

      const alpha = (e.alpha || 0) - (initialOffset || 0)

      setOrientation({
        absolute: e.absolute,
        alpha: alpha < 0 ? alpha + 360 : alpha,
        beta: e.beta || 0,
        gamma: e.gamma || 0,
      })
    })

    window.addEventListener("deviceorientation", onOrientationChange)

    return () => {
      window.removeEventListener("deviceorientation", onOrientationChange)
    }
  }, [throttleTimeMs])

  return orientation
}
