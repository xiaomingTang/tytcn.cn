import { State as UserState } from '@Src/store/user'
import { Storage, STORAGE_KEY } from '@Src/utils/storage'

interface LocalUsers {
  [key: string]: UserState;
}

export class UserModel {
  static getAllLocalUsers() {
    return Storage.getAndParse<LocalUsers>(STORAGE_KEY.USER_MODEL) || {}
  }

  static removeLocalUser(id: string) {
    const users = UserModel.getAllLocalUsers()
    delete users[id]
    Storage.setAndStringify<LocalUsers>(STORAGE_KEY.USER_MODEL, users)
  }

  static clearAllLocalUsers() {
    Storage.remove(STORAGE_KEY.USER_MODEL)
  }

  static setLocalUser(id: string, newUser: UserState | null) {
    const users = UserModel.getAllLocalUsers()
    if (newUser === null) {
      delete users[id]
    } else {
      users[newUser.id] = {
        ...newUser,
        token: '',
      }
    }
    Storage.setAndStringify<LocalUsers>(STORAGE_KEY.USER_MODEL, users)
  }

  static getLastOnlineUserId() {
    return Storage.get(STORAGE_KEY.LAST_ONLINE_USER_ID)
  }

  static setLastOnlineUserId(userId: string | null) {
    Storage.set(STORAGE_KEY.LAST_ONLINE_USER_ID, userId)
  }
}
