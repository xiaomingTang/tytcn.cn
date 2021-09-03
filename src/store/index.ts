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

export type SyncAction = GlobalSettingsAction | UserAction | ChatAction | LayoutAction
export type AsyncAction<R> = ThunkAction<Promise<R>, State, null, SyncAction>

export type MixedDispatch = ThunkDispatch<State, null, SyncAction>

export default store
