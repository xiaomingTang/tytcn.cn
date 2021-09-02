import {
  createStore, combineReducers, applyMiddleware,
} from 'redux'
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk'
// import logger from 'redux-logger'

import {
  initState as globalSettingsInitState,
  reducer as globalSettingsReducer,
  Action as GlobalSettingsAction,
} from './globalSettings'

import {
  initState as chatInitState,
  reducer as chatReducer,
  Action as ChatAction,
} from './chat'

import {
  initState as userInitState,
  reducer as userReducer,
  Action as UserAction,
} from './user'

const initState = {
  globalSettings: globalSettingsInitState,
  chat: chatInitState,
  user: userInitState,
}
export type State = typeof initState

const reducer = combineReducers({
  globalSettings: globalSettingsReducer,
  user: userReducer,
  chat: chatReducer,
})

const store = createStore(reducer, initState, applyMiddleware(
  thunk,
  // logger,
))

export type SyncAction = GlobalSettingsAction | UserAction | ChatAction
export type AsyncAction<R> = ThunkAction<Promise<R>, State, null, SyncAction>

export type MixedDispatch = ThunkDispatch<State, null, SyncAction>

export default store
