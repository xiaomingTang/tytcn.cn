import { http } from '@Src/utils/api'
import { Types } from '.'

export async function signin(data: Types.SigninQuery) {
  return http.post<Types.SigninRes>('/user/signin', {
    data,
  })
}

export async function getMyself() {
  return http.get<Types.GetMyselfRes>('/user/myself', {
    customConfig: {
      signinOn401: false,
    },
  })
}

export async function getAuthCode(data: Types.GetAuthCodeQuery) {
  return http.post<Types.GetAuthCodeRes>('/auth-code/new', {
    data,
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
