import { ensureImpossibleAction } from './utils'

export interface State {
  id: string;
  nickname: string;
  avatar: string;
  token: string;
  usageScore: number;
}

export const initState: State = {
  id: '',
  nickname: '',
  avatar: '',
  token: '',
  usageScore: 0,
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
