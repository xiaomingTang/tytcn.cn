export const STORAGE_KEY = {
  USER_MODEL: 'users',
  LAST_ONLINE_USER_ID: 'lastOnlineUserId',
}

export class Storage {
  static get(key: string): string | null {
    return localStorage.getItem(key)
  }

  static set(key: string, value: string | null): void {
    if (value === null) {
      Storage.remove(key)
    } else {
      localStorage.setItem(key, value)
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key)
  }

  static clear(): void {
    localStorage.clear()
  }

  static getAndParse<T>(key: string): T | null {
    try {
      const value = Storage.get(key)
      if (typeof value === 'string') {
        return JSON.parse(value) as T
      }
    } catch (err) {
      // pass
    }
    return null
  }

  static setAndStringify<T>(key: string, value: T | null) {
    if (value === null) {
      Storage.remove(key)
    } else {
      Storage.set(key, JSON.stringify(value))
    }
  }
}
