import { UserModel } from '@Src/models/user'
import { ensureImpossibleAction } from './utils'

export enum UserOnlineState {
  On = 'On',
  Off = 'Off',
}

export interface State {
  id: string;
  nickname: string;
  avatar: string;
  token: string;
  phone: string;
  email: string;
  onlineState: UserOnlineState;
  friends: State[];
  roles: string[];
  groups: string[];
  ownGroups: string[];
  postedMessages: string[];
  receivedMessages: string[];
}

export const initState: State = Object.values(UserModel.getAllLocalUsers())[0] || {
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
        ...state,
        ...action.value,
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
