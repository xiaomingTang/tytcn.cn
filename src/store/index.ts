import {
  createStore, combineReducers, applyMiddleware,
} from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
// import logger from 'redux-logger'

import {
  initState as chatInitState,
  reducer as chatReducer,
  Action as ChatAction,
} from './chat'

import {
  initState as globalSettingsInitState,
  reducer as globalSettingsReducer,
  Action as GlobalSettingsAction,
} from './globalSettings'

import {
  initState as layoutInitState,
  reducer as layoutReducer,
  Action as LayoutAction,
} from './layout'

import {
  initState as userInitState,
  reducer as userReducer,
  Action as UserAction,
} from './user'

const initState = {
  chat: chatInitState,
  globalSettings: globalSettingsInitState,
  layout: layoutInitState,
  user: userInitState,
}
export type State = typeof initState

const reducer = combineReducers({
  chat: chatReducer,
  globalSettings: globalSettingsReducer,
  layout: layoutReducer,
  user: userReducer,
})

const store = createStore(reducer, initState, applyMiddleware(
  thunk,
  // logger,
))

/**
 * ``` typescript
 * // for example
 * import { useDispatch } from 'react-redux'
 * import { Dispatch } from 'redux'
 * import { SyncAction } from 'path/to/the/store'
 *
 * const dispatch = useDispatch<Dispatch<SyncAction>>()
 * ```
 */
export type SyncAction = GlobalSettingsAction | UserAction | ChatAction | LayoutAction

/**
 * ``` typescript
 * // for example
 * import { AsyncAction } from 'path/to/the/store'
 *
 * const asyncAction: AsyncAction<string> = async (dispatch) => {
 *   await sleep(1000)
 *   dispatch({
 *     type: 'some-sync-action',
 *   })
 *   return ''
 * }
 * ```
 */
export type AsyncAction<R> = ThunkAction<Promise<R>, State, null, SyncAction>

/**
 * ``` typescript
 * // for example
 * import { Dispatch } from 'redux'
 * import { useDispatch } from 'react-redux'
 * import { MixedDispatch, AsyncAction } from 'path/to/the/store'
 *
 * function Component() {
 *   const dispatch = useDispatch<MixedDispatch>()
 *   // you can define asyncAction in reducer or wherever you like
 *   const asyncAction: AsyncAction<any> = // ...
 *   const result = await dispatch(asyncAction)
 * }
 * ```
 */
export type MixedDispatch = ThunkDispatch<State, null, SyncAction>

export default store
