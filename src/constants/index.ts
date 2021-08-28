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
