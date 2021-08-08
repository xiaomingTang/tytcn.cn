import { State as UserState } from '@Src/store/user'

// 登录
export interface SigninQuery {
  accountType: 'email' | 'phone';
  signinType: 'passport' | 'authCode' | 'qrcode';
  account: string;
  code: string;
}

export type SigninRes = UserState

// 获取验证码
export interface GetAuthCodeQuery {
  accountType: 'email' | 'phone';
  account: string;
}

export type GetAuthCodeRes = string;

// 获取登录二维码
export type GetQrcodeQuery = void

export interface GetQrcodeRes {
  token: string;
  /**
   * ms
   */
  expiredAt: number;
}

// 检查二维码登录是否成功
export interface CheckQrcodeSigninQuery {
  token: string;
}

export type CheckQrcodeSigninRes = boolean
