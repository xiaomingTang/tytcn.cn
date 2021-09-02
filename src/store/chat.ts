import { ensureImpossibleAction } from './utils'

export interface ChatTarget {
  type: 'group' | 'user';
  id: string;
  name?: string;
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
  type: '@chat/update';
  value: ChatTarget;
}

export function reducer(state = initState, action: Action): State {
  switch (action.type) {
    case '@chat/update': {
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
