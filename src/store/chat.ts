import { ensureImpossibleAction } from './utils'

export interface ChatTarget {
  type: 'group' | 'user';
  id: string;
}

export interface State {
  target: ChatTarget;
}

export const initState: State = {
  target: {
    type: 'user',
    id: '',
  },
}

export type Action = {
  type: '@chat/toggle';
  value: ChatTarget;
}

export function reducer(state = initState, action: Action): State {
  switch (action.type) {
    case '@chat/toggle': {
      return {
        ...state,
        target: {
          ...action.value,
        },
      }
    }
    default: {
      // @ts-ignore
      ensureImpossibleAction('@chat/', action)
      return state
    }
  }
}
