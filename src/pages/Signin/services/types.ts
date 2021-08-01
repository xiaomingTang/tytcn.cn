import { State as UserState } from '@Src/store/user'

export interface SigninByTokenQuery {
  username: string;
  token: string;
}

export type SigninByTokenRes = UserState

export interface SigninByPassportQuery {
  username: string;
  passport: string;
}

export type SigninByPassportRes = UserState

export interface SigninByAuthCodeQuery {
  username: string;
  authCode: string;
}

export type SigninByAuthCodeRes = UserState

export type SigninByQrcodeQuery = void

export type SigninByQrcodeRes = UserState

export type GetQrcodeQuery = void

export interface GetQrcodeRes {
  token: string;
  /**
   * ms
   */
  expiredAt: number;
}

export interface CheckQrcodeSigninQuery {
  token: string;
}

export type CheckQrcodeSigninRes = boolean
