import { State as UserState } from '@Src/store/user'
import { Storage, STORAGE_KEY } from '@Src/utils/storage'

interface LocalUsers {
  [key: string]: UserState;
}

export class UserModel {
  static getAllLocalUsers(): LocalUsers {
    return Storage.getAndParse<LocalUsers>(STORAGE_KEY.USER_MODEL) || {}
  }

  static clearAllLocalUsers(): void {
    Storage.remove(STORAGE_KEY.USER_MODEL)
  }

  static getLocalUser(id: string): UserState | null {
    if (!id) {
      return null
    }
    return UserModel.getAllLocalUsers()[id] ?? null
  }

  static setLocalUser(id: string, newUser: UserState | null): void {
    if (!id) {
      console.error('id is empty')
      return
    }
    const users = UserModel.getAllLocalUsers()
    if (!newUser) {
      delete users[id]
    } else {
      users[id] = {
        ...newUser,
        id,
        // 移除 token
        token: '',
      }
    }
    Storage.setAndStringify<LocalUsers>(STORAGE_KEY.USER_MODEL, users)
  }

  static getLastOnlineUserId(): string {
    return Storage.get(STORAGE_KEY.LAST_ONLINE_USER_ID) ?? ''
  }

  static setLastOnlineUserId(userId = ''): void {
    Storage.set(STORAGE_KEY.LAST_ONLINE_USER_ID, userId)
  }

  static getLastOnlineUser(): UserState | null {
    return this.getLocalUser(this.getLastOnlineUserId() ?? '') ?? null
  }

  static signin(user: UserState): UserState {
    const { id, token } = user
    const { ...userWithoutToken } = user
    // token 置空
    userWithoutToken.token = ''
    Storage.set('Authorization', `Bearer ${token}`)
    UserModel.setLastOnlineUserId(id)
    UserModel.setLocalUser(id, userWithoutToken)
    return userWithoutToken
  }

  static signout(options?: {
    clearUser?: boolean;
  }): void {
    const { clearUser = false } = options || {}
    Storage.remove('Authorization')
    if (clearUser) {
      UserModel.setLastOnlineUserId()
      UserModel.clearAllLocalUsers()
    }
  }
}
