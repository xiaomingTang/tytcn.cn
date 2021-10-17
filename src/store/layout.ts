import { ensureImpossibleAction } from './utils'

export interface State {
  chatListVisible: boolean;
  asideVisible: boolean;
}

export const initState: State = {
  chatListVisible: false,
  asideVisible: false,
}

export type Action = {
  type: '@layout/update';
  value: Partial<State>;
}

export function reducer(state = initState, action: Action): State {
  switch (action.type) {
    case '@layout/update': {
      return {
        ...state,
        ...action.value,
      }
    }
    default: {
      ensureImpossibleAction('@layout/', action as never)
      return state
    }
  }
}
