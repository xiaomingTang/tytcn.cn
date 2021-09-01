import { Types } from '@Src/services'
import { Storage, STORAGE_KEY } from '@Src/utils/storage'

interface LocalUsers {
  [key: string]: Types.User;
}

export class UserModel {
  static getAllLocalUsers(): LocalUsers {
    return Storage.getAndParse<LocalUsers>(STORAGE_KEY.USER_MODEL) || {}
  }

  static clearAllLocalUsers(): void {
    Storage.remove(STORAGE_KEY.USER_MODEL)
  }

  static getLocalUser(id: string): Types.User | null {
    if (!id) {
      return null
    }
    return UserModel.getAllLocalUsers()[id] ?? null
  }

  static setLocalUser(id: string, newUser: Types.User | null): void {
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

  static getLastOnlineUser(): Types.User | null {
    return this.getLocalUser(this.getLastOnlineUserId() ?? '') ?? null
  }

  static signin(user: Types.User): Types.User {
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
