import { http } from '@Src/utils/api'
import { Types } from '.'

export async function signin(data: Types.SigninQuery) {
  return http.post<Types.SigninRes>('/user/signin', {
    data,
  })
}

export async function getAuthCode(params: Types.GetAuthCodeQuery) {
  return http.get<Types.GetAuthCodeRes>('/authCode', {
    params,
  })
}

export async function getQrcode(params: Types.GetQrcodeQuery) {
  return http.get<Types.GetQrcodeRes>('/signinQrcode', {
    params,
  })
}

export async function checkQrcodeSignin(params: Types.CheckQrcodeSigninQuery) {
  return http.get<Types.CheckQrcodeSigninRes>('/signinQrcode/isLogin', {
    params,
  })
}
