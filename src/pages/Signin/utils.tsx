import React from 'react'
import {
  FormItemProps, FormProps, message, Modal,
} from 'antd'
import store from '@Src/store'
import { isMobilePhone, isEmail } from 'class-validator'

import { SigninType } from '@Src/constants'
import { Storage } from '@Src/utils/storage'
import { UserModel } from '@Src/models/user'
import { State as UserState } from '@Src/store/user'

import { Apis } from './services'
import { SigninBox, SigninBoxProps } from './components/SigninBox'

type SigninBoxDisplay = 'modal' | 'single-page'

/**
 * 直接调用, 根据 type 来决定 跳转到登陆页 或者 弹出登录框
 */
export function signin(type: SigninBoxDisplay) {
  switch (type) {
    case 'single-page': {
      window.location.href = `/signin?from=${window.encodeURI(window.location.href)}`
      break
    }
    default: {
      const { destroy } = Modal.info({
        modalRender() {
          return <SigninBox
            style={{
              pointerEvents: 'all',
              boxShadow: '0 0 20px #565656',
            }}
            onSuccess={(user) => {
              destroy()
              // 更新用户信息 store
              store.dispatch({
                type: '@user/update',
                value: user,
              })
            }}
          />
        },
        style: {
          paddingBottom: '0',
        },
        centered: true,
        mask: true,
        maskClosable: true,
        keyboard: true,
      })
      break
    }
  }
}

export function checkIsValidAuthCode(value = ''): Promise<true> {
  return new Promise((resolve, reject) => {
    if (value.length !== 4) {
      reject(new Error('请输入 4 位验证码'))
    } else {
      resolve(true)
    }
  })
}

type Rules = Required<FormItemProps<any>>['rules']

export const accountRules: Rules = [
  {
    validator(_, value = '') {
      return new Promise((resolve, reject) => {
        if (isMobilePhone(value, 'zh-CN') || isEmail(value)) {
          resolve(true)
        } else {
          reject(new Error('请输入有效的手机号或邮箱'))
        }
      })
    },
  },
]

export const passwordRules: Rules = [
  {
    validator(_, value = '') {
      return new Promise((resolve, reject) => {
        if (value.length < 6 || value.length > 16) {
          reject(new Error('密码长度应为 6- 16'))
        } else {
          resolve(true)
        }
      })
    },
  },
]

export const authCodeRules: Rules = [
  {
    validator(_, value = '') {
      return checkIsValidAuthCode(value)
    },
  },
]

const defaultSigninType: SigninType = 'password'

function defaultOnSuccess() {
  message.success('登录成功, 即将跳转...')
  window.setTimeout(() => {
    window.location.href = new URL(window.location.href).searchParams.get('from') || '/'
  }, 500)
}

export function geneOnFinish({
  signinType = defaultSigninType, onSuccess = defaultOnSuccess,
}: Pick<SigninBoxProps, 'signinType' | 'onSuccess'>) {
  const onFinish: FormProps['onFinish'] = ({ account, password, authCode }) => {
    Apis.signin({
      account,
      code: signinType === 'password' ? password : authCode,
      signinType,
      accountType: isEmail(account) ? 'email' : 'phone',
    })
      .then((res) => {
        Storage.set('Authorization', `Bearer ${res.token}`)
        UserModel.setLocalUser(res.id, res)
        UserModel.setLastOnlineUserId(res.id)
        onSuccess(UserModel.getLocalUser(res.id) as UserState)
      })
      .catch((err) => {
        message.error(err.message)
      })
  }
  return onFinish
}
