export type AccountType = 'phone' | 'email'

export type CodeType = 'signin'

export type SigninType = 'password' | 'authCode' | 'qrcode'

export enum UserOnlineState {
  On = 'On',
  Off = 'Off',
}

export enum MessageType {
  Text = 'Text',
  Image = 'Image',
  Video = 'Video',
  File = 'File',
}

/**
 * 图源:
 * https://zhuanlan.zhihu.com/p/54060187
 * https://www.hippopx.com/
 */
export const availableBackgroundImages: string[] = new Array(10)
  .fill(0)
  .map((_, i) => `/static/images/bg-blurred/${(i + 1).toString().padStart(2, '0')}.jpg`)
