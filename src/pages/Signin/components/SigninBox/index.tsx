import React, { useState, useCallback } from 'react'
import {
  Button, Form, FormProps, Input, Tabs,
} from 'antd'
import { UserModel } from '@Src/models/user'
import { http, useApiWhen } from '@Src/utils/api'

import Styles from './index.module.less'
import { Apis } from '../../services'

const { TabPane } = Tabs

type SigninType = 'passport' | 'authCode' | 'qrcode'

interface Props {
  initSigninType?: SigninType;
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

  const onFinish: FormProps['onFinish'] = useCallback((values) => {
    http.request({
      url: '/user/search/email/1038761793@qq.com',
    })
      .then(console.log)
      .catch(console.warn)
  }, [])

  return <div className={Styles.container}>
    <div className={Styles.header}>
      登录 tytcn.cn
    </div>

    <div className={Styles.body}>
      <Tabs activeKey={signinType} onChange={(key) => setSigninType(key as SigninType)}>
        <TabPane key='passport' tab='密码登录'>
          <Form onFinish={onFinish}>
            <Form.Item
              name='account'
            >
              <Input placeholder='手机号或邮箱' />
            </Form.Item>
            <Form.Item
              name='password'
            >
              <Input placeholder='密码(6-16位英文+数字)' />
            </Form.Item>
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
        <TabPane key='authCode' tab='验证码登录'>
          <Form onFinish={onFinish}>
            <Form.Item
              name='account'
            >
              <Input.Search
                placeholder='手机号或邮箱'
                allowClear
                enterButton='获取验证码'
              />
            </Form.Item>
            <Form.Item
              name='password'
            >
              <Input placeholder='验证码(6位数字)' />
            </Form.Item>
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
