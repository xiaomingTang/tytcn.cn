import {
  useState, useEffect, Dispatch, SetStateAction,
} from "react"

export function voidFunc() {
  // pass
}

export function joinSpace(...arr: (string | false | undefined | null)[]) {
  return arr.filter((item) => !!item).join(" ")
}

/**
 * - 生成一个"能将状态持久化，不因组件destroy而消失的hook"
 * - 由于需要持久化，因此内存占用不会回收，必要时才能使用，不可滥用
 *
 * @example
 * ```tsx
 * type CustomType = boolean
 * const usePermanentState = genePermanentState<CustomType>()
 *
 * function CustomComponent() {
 *   // value won't be destroyed even if component be destroyed
 *   const [value, setValue] = usePermanentState()
 * }
 * ```
 */
export function genePermanentState<T>() {
  let memo: T | undefined
  return function usePermanentState(initialState?: T | (() => T)): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
    const [state, setState] = useState(memo || initialState)

    useEffect(() => {
      memo = state
    }, [state])

    return [state, setState]
  }
}
