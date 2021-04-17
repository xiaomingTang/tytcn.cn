import React, {
  DOMAttributes, useCallback, useEffect, useRef, useState,
} from "react"

type EventHandlers = Pick<
  DOMAttributes<Element>,
  "onPointerDown" | "onPointerUp"
  // | "onPointerOver"| "onPointerOut" | "onPointerLeave"
  | "onPointerCancel"
  | "onClick" | "onDoubleClick"
>

interface Pos {
  x: number;
  y: number;
  time: number;
}

const defaultEmptyPos: Pos = {
  x: -1,
  y: -1,
  time: -1,
}

interface SimulateProps {
  children: React.ReactElement<EventHandlers>;
  alwaysSimulate?: boolean;
  pointerMemoryLength?: number;
  clickMemoryLength?: number;
  clickDelta?: number;
  clickDeltaTimeMs?: number;
  doubleClickDelta?: number;
  doubleClickDeltaTimeMs?: number;
  /**
   * -1: 默认值, 表示任意按键均可触发
   * 0 ~ 4: MouseEvent.button 的值, 表明只有该按键才能触发
   * https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent/button
   */
  availableButton?: -1 | 0 | 1 | 2 | 3 | 4;
}

function rawIsClick(prevPos: Pos, curPos: Pos, delta: number, deltaTimeMs: number): boolean {
  if (!prevPos || !curPos) {
    return false
  }
  if (prevPos.x < 0 || prevPos.y < 0 || prevPos.time < 0 || curPos.x < 0 || curPos.y < 0 || curPos.time < 0) {
    return false
  }
  return curPos.time - prevPos.time <= deltaTimeMs && (prevPos.x - curPos.x) ** 2 + (prevPos.y - curPos.y) ** 2 <= delta
}

function rawAppendArrayLimit<T>(arr: T[], value: T, len: number): T[] {
  const newArr = [...arr, value]
  if (newArr.length <= len) {
    return newArr
  }
  newArr.splice(0, newArr.length - len)
  return newArr
}

let globalClickEventAvailable = false

export function useClickEventAvailable() {
  const [isAvailable, setIsAvailable] = useState(globalClickEventAvailable)

  useEffect(() => {
    const setter = () => {
      setIsAvailable(true)
      globalClickEventAvailable = true
    }

    document.addEventListener("click", setter, {
      once: true,
    })

    return () => {
      document.removeEventListener("click", setter)
    }
  }, [])

  return isAvailable
}

export function SimulateClick({
  children,
  alwaysSimulate = false,
  pointerMemoryLength = 4, clickMemoryLength = 2,
  clickDelta = 10, clickDeltaTimeMs = 200,
  doubleClickDelta = 10, doubleClickDeltaTimeMs = 400,
  availableButton: button = 0,
}: SimulateProps) {
  const isClickEventAvailable = useClickEventAvailable()
  const pointerPosListRef = useRef<Pos[]>([])
  const clickPosListRef = useRef<Pos[]>([])

  const isClick = useCallback(() => {
    const len = pointerPosListRef.current.length
    return rawIsClick(pointerPosListRef.current[len - 2], pointerPosListRef.current[len - 1], clickDelta, clickDeltaTimeMs)
  }, [clickDelta, clickDeltaTimeMs])

  const isDoubleClick = useCallback(() => {
    const len = clickPosListRef.current.length
    return rawIsClick(clickPosListRef.current[len - 2], clickPosListRef.current[len - 1], doubleClickDelta, doubleClickDeltaTimeMs)
  }, [doubleClickDelta, doubleClickDeltaTimeMs])

  const appendPointerPosList = useCallback((curPos: Pos) => {
    pointerPosListRef.current = rawAppendArrayLimit(pointerPosListRef.current, curPos, pointerMemoryLength)
  }, [pointerMemoryLength])

  const appendClickPosList = useCallback((curPos: Pos) => {
    clickPosListRef.current = rawAppendArrayLimit(clickPosListRef.current, curPos, clickMemoryLength)
  }, [clickMemoryLength])

  const onPointerDown: EventHandlers["onPointerDown"] = useCallback((e) => {
    if (button !== -1 && e.button !== button) {
      appendPointerPosList(defaultEmptyPos)
      return
    }
    if (children.props.onPointerDown) {
      children.props.onPointerDown(e)
    }
    appendPointerPosList({
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    })
  }, [appendPointerPosList, button, children.props])

  const onPointerUp: EventHandlers["onPointerUp"] = useCallback((e) => {
    if (children.props.onPointerUp) {
      children.props.onPointerUp(e)
    }
    const curPos = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    }
    appendPointerPosList(curPos)
    if (isClick()) {
      if (children.props.onClick) {
        children.props.onClick(e)
      }
      appendClickPosList(curPos)

      if (isDoubleClick()) {
        if (children.props.onDoubleClick) {
          children.props.onDoubleClick(e)
        }
        appendClickPosList(defaultEmptyPos)
      }
    }
    appendPointerPosList(defaultEmptyPos)
  }, [appendClickPosList, appendPointerPosList, children.props, isClick, isDoubleClick])

  const onPointerCancel: EventHandlers["onPointerCancel"] = useCallback((e) => {
    if (children.props.onPointerCancel) {
      children.props.onPointerCancel(e)
    }
    appendPointerPosList(defaultEmptyPos)
  }, [appendPointerPosList, children.props])

  if (alwaysSimulate || !isClickEventAvailable) {
    return React.cloneElement(children, {
      onPointerDown,
      onPointerUp,
      onPointerCancel,
      onClick: undefined,
      onDoubleClick: undefined,
    })
  }

  return children
}
