import {
  FormItemProps, FormProps, message,
} from 'antd'
import { isMobilePhone, isEmail } from 'class-validator'
import { voidFunc } from 'xiaoming-hooks'

import { SigninType } from '@Src/constants'
import { UserModel } from '@Src/models/user'

import { Apis } from '../../services'
import { SigninBoxProps } from './index'

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

export function geneOnFinish({
  signinType = defaultSigninType, onSuccess = voidFunc,
}: Pick<SigninBoxProps, 'signinType' | 'onSuccess'>) {
  const onFinish: FormProps['onFinish'] = ({ account, password, authCode }) => {
    Apis.signin({
      account,
      code: signinType === 'password' ? password : authCode,
      signinType,
      accountType: isEmail(account) ? 'email' : 'phone',
    })
      .then((res) => {
        onSuccess(UserModel.signin(res))
      })
      .catch((err) => {
        message.error(err.message)
      })
  }
  return onFinish
}
