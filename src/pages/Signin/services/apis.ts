import { http } from '@Src/utils/api'
import { Types } from '.'

export async function signinByToken(data: Types.SigninByTokenQuery) {
  return http.post<Types.SigninByTokenRes>('/signin?token', {
    data,
  })
}

export async function signinByPassport(data: Types.SigninByPassportQuery) {
  return http.post<Types.SigninByPassportRes>('/signin?passport', {
    data,
  })
}

export async function signinByAuthCode(data: Types.SigninByAuthCodeQuery) {
  return http.post<Types.SigninByAuthCodeRes>('/signin?authCode', {
    data,
  })
}

export async function signinByQrcode(data: Types.SigninByQrcodeQuery) {
  return http.post<Types.SigninByQrcodeRes>('/signin?qrcode', {
    data,
  })
}

export async function getQrcode(data: Types.GetQrcodeQuery) {
  return http.get<Types.GetQrcodeRes>('/qrcode/get', {
    data,
  })
}

export async function checkQrcodeSignin(params: Types.CheckQrcodeSigninQuery) {
  return http.get<Types.CheckQrcodeSigninRes>('/qrcode/check', {
    params,
  })
}
