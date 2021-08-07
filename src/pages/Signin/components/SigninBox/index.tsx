import React, { useState, useCallback } from 'react'
import {
  Button, Form, FormItemProps, FormProps, Input, Tabs,
} from 'antd'
import { UserModel } from '@Src/models/user'
import { http, useApiWhen } from '@Src/utils/api'
import { isPhoneNumber, isEmail } from 'class-validator'

import Styles from './index.module.less'
import { Apis } from '../../services'

type SigninType = 'passport' | 'authCode' | 'qrcode'

interface Props {
  initSigninType?: SigninType;
}

const { TabPane } = Tabs

type Rules = FormItemProps<any>['rules']

const accountRules: Rules = [
  {
    validator(_, value = '') {
      return new Promise((resolve, reject) => {
        if (isPhoneNumber(value, 'CN') || isEmail(value)) {
          resolve(true)
        } else {
          reject(new Error('请输入有效的手机号或邮箱'))
        }
      })
    },
  },
]

const passwordRules: Rules = [
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

const authCodeRules: Rules = [
  {
    validator(_, value = '') {
      return new Promise((resolve, reject) => {
        if (value.length !== 4) {
          reject(new Error('请输入 4 位验证码'))
        } else {
          resolve(true)
        }
      })
    },
  },
]

function signinBy(signinType: SigninType) {
  const onFinish: FormProps['onFinish'] = ({ account, code }) => {
    http.request({
      method: 'post',
      url: '/user/signin',
      data: {
        account,
        code,
        signinType,
        accountType: isEmail(account) ? 'email' : 'phone',
      },
    })
      .then(console.log)
      .catch(console.warn)
  }
  return onFinish
}

export function SigninBox({
  initSigninType,
}: Props) {
  const [signinType, setSigninType] = useState((): SigninType => {
    if (initSigninType) {
      return initSigninType
    }
    const localUsers = UserModel.sortUsers(Object.values(UserModel.getAllLocalUsers()))
    if (localUsers.length > 0) {
      return 'passport'
    }
    return 'authCode'
  })

  return <div className={Styles.container}>
    <div className={Styles.header}>
      登录 tytcn.cn
    </div>

    <div className={Styles.body}>
      <Tabs activeKey={signinType} onChange={(key) => setSigninType(key as SigninType)}>
        <TabPane key='passport' tab='密码登录'>
          <Form onFinish={signinBy('passport')} validateTrigger={'onBlur'}>
            <Form.Item
              name='account'
              required
              rules={accountRules}
            >
              <Input placeholder='手机号或邮箱' />
            </Form.Item>
            <Form.Item
              name='code'
              required
              rules={passwordRules}
            >
              <Input placeholder='密码(6-16位英文+数字)' />
            </Form.Item>
            <Form.Item>
              <Button
                block
                type='primary'
                htmlType='submit'
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key='authCode' tab='验证码登录/注册'>
          <Form onFinish={signinBy('authCode')} validateTrigger={'onBlur'}>
            <Form.Item
              name='account'
              required
              rules={accountRules}
            >
              <Input.Search
                placeholder='手机号或邮箱'
                allowClear
                enterButton='获取验证码'
              />
            </Form.Item>
            <Form.Item
              name='code'
              required
              rules={authCodeRules}
            >
              <Input placeholder='验证码(4 位)' />
            </Form.Item>
            <p className={Styles.notice}>如果您的手机或邮箱尚未注册本网站, 将会为您自动注册</p>
            <Form.Item>
              <Button
                block
                type='primary'
                htmlType='submit'
              >
                登录/注册
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane key='qrcode' tab='扫码登录'>
          扫码登录
        </TabPane>
      </Tabs>
    </div>

    <div className='body'></div>
  </div>
}
