import { useEffect, useState } from 'react'
import { throttle } from 'lodash-es'

import { voidFunc } from './others'

type Disconnect = () => void

// @ts-ignore
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

export function observeDOM(obj: Node, callback: () => void): Disconnect {
  if (!obj || obj.nodeType !== Node.ELEMENT_NODE) {
    return voidFunc
  }

  if (MutationObserver) {
    // define a new observer
    const mutationObserver = new MutationObserver(callback)

    // have the observer observe foo for changes in children
    mutationObserver.observe(obj, { childList: true, subtree: true })
    return () => {
      mutationObserver.disconnect()
    }
  }

  // fallback
  obj.addEventListener('DOMNodeInserted', callback, false)
  obj.addEventListener('DOMNodeRemoved', callback, false)
  return () => {
    if (obj?.nodeType === Node.ELEMENT_NODE) {
      obj.removeEventListener('DOMNodeInserted', callback, false)
      obj.removeEventListener('DOMNodeRemoved', callback, false)
    }
  }
}

interface ScrollInfo {
  distanceWithTop: number;
  distanceWithBottom: number;
  element: HTMLElement;
}

const defaultScrollInfo: ScrollInfo = {
  distanceWithTop: 0,
  distanceWithBottom: 0,
  element: document.body,
}

export function getScrollInfo(element: HTMLElement): ScrollInfo {
  return {
    distanceWithTop: element.scrollTop,
    distanceWithBottom: element.scrollHeight - element.scrollTop - element.clientHeight,
    element,
  }
}

export function useScrollInfo(throttleTime = 500) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>(defaultScrollInfo)

  useEffect(() => {
    if (element) {
      const onScroll = throttle(() => {
        setScrollInfo(getScrollInfo(element))
      }, throttleTime, {
        leading: true,
        trailing: true,
      })
      onScroll()
      element.addEventListener('scroll', onScroll)
      const disconnect = observeDOM(element, onScroll)
      return () => {
        element.removeEventListener('scroll', onScroll)
        disconnect()
      }
    }
    return voidFunc
  }, [element, throttleTime])

  return [scrollInfo, setElement] as const
}
