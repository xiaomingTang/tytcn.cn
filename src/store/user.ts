import { UserOnlineState } from '@Src/constants'
import { UserModel } from '@Src/models/user'
import { Types } from '@Src/services'
import { ensureImpossibleAction } from './utils'

export type State = Types.User

export const initState: State = UserModel.getLastOnlineUser() || {
  id: '',
  nickname: '',
  avatar: '',
  token: '',
  phone: '',
  email: '',
  onlineState: UserOnlineState.Off,
  friends: [],
  roles: [],
  groups: [],
  ownGroups: [],
  postedMessages: [],
  receivedMessages: [],
}

export type Action = {
  type: '@user/update';
  value: Partial<State>;
} | {
  type: '@user/clear';
}

export function reducer(state = initState, action: Action): State {
  switch (action.type) {
    case '@user/update': {
      return {
        ...initState,
        ...(action.value ?? initState),
      }
    }
    case '@user/clear': {
      return initState
    }
    default: {
      ensureImpossibleAction('@user/', action)
      return state
    }
  }
}
