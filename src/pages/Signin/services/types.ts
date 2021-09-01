import { AccountType, CodeType, SigninType } from '@Src/constants'
import { Types } from '@Src/services'

// 登录
export interface SigninQuery {
  accountType: AccountType;
  signinType: SigninType;
  account: string;
  code: string;
}

export type SigninRes = Types.User

export type GetMyselfRes = Types.User

// 获取验证码
export interface GetAuthCodeQuery {
  accountType: AccountType;
  codeType: CodeType;
  account: string;
}

/**
 * 临时性措施, 网站暂未接入验证码, 所以直接将验证码返回给前端
 */
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
