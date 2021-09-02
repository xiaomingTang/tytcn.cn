import React, { useState, useCallback, useEffect } from 'react'
import {
  Avatar, Button, Form, Input, message, Tabs, Tooltip,
} from 'antd'
import { isEmail } from 'class-validator'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useTimer } from 'xiaoming-hooks'
import { SearchOutlined } from '@ant-design/icons'

import { UserModel } from '@Src/models/user'
import { SigninType } from '@Src/constants'
import { joinSpace } from '@Src/utils/others'
import { Types } from '@Src/services'

import IconImg from '../../assets/icon.png'
import { Apis } from '../../services'
import {
  accountRules, authCodeRules, passwordRules, geneOnFinish,
} from './utils'

import Styles from './index.module.less'

const { TabPane } = Tabs
export interface SigninBoxProps {
  signinType?: SigninType;
  onSuccess?: (user: Types.User) => void;
  className?: string;
  style?: React.HTMLAttributes<HTMLDivElement>['style'];
}

export function SigninBox({
  signinType: initSigninType,
  onSuccess,
  className = '',
  style,
}: SigninBoxProps) {
  useEffect(() => {
    Apis.getMyself().then((res) => {
      if (res && onSuccess) {
        onSuccess(res)
      }
    })
  // onSuccess 不加入 deps, 防止失误传入频繁变动的 onSuccess 时, 导致该 api 被频繁调用
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [passwordForm] = Form.useForm()
  const [authCodeForm] = Form.useForm()
  const [isFetchingAuthCode, setIsFetchingAuthCode] = useState(false)
  const { duration, resetTimer } = useTimer()

  const [signinType, setSigninType] = useState((): SigninType => {
    if (initSigninType) {
      return initSigninType
    }
    const localUsers = Object.values(UserModel.getAllLocalUsers())
    if (localUsers.length > 0) {
      return 'password'
    }
    // 本地无用户时默认返回验证码登录
    return 'authCode'
  })

  const onFetchAuthCode = useCallback(async (account = '') => {
    try {
      await authCodeForm.validateFields(['account'])
    } catch (error) {
      return
    }
    try {
      setIsFetchingAuthCode(true)
      const authCode = await Apis.getAuthCode({
        account,
        accountType: isEmail(account) ? 'email' : 'phone',
        codeType: 'signin',
      }).then((res) => {
        resetTimer({
          target: Date.now() + 60000,
          throttleMs: 1000,
          type: 'COUNT_TO',
        })
        return res
      }).finally(() => {
        setIsFetchingAuthCode(false)
      })
      const key = 'unique_key_for_auth_code_copied'
      const geneMessage = (code: string, copied = false) => (<>
        您的验证码为 {authCode}{' '}
        <CopyToClipboard text={authCode}
          onCopy={() => {
            message.success({
              key,
              content: geneMessage(code, true),
              duration: 2,
            })
          }}
        >
          <Button>
            {copied ? '已复制' : '点击复制'}
          </Button>
        </CopyToClipboard>
      </>)
      message.info({
        key,
        content: geneMessage(authCode),
        duration: 3,
      })
    } catch (err) {
      message.error(err.message)
    }
  }, [authCodeForm, resetTimer])

  // 更新表单的 account 项
  useEffect(() => {
    switch (signinType) {
      case 'authCode': {
        const account = passwordForm.getFieldValue('account')
        if (account) {
          authCodeForm.setFieldsValue({
            account,
          })
        }
        break
      }
      case 'password': {
        const account = authCodeForm.getFieldValue('account')
        if (account) {
          passwordForm.setFieldsValue({
            account,
          })
        }
        break
      }
      default:
        break
    }
  }, [authCodeForm, passwordForm, signinType])

  return <div className={joinSpace(Styles.container, className)} style={style}>
    <div className={Styles.header}>
      <Avatar src={IconImg} shape='square' alt={process.env.APP_NAME} /> 登录 {process.env.APP_NAME}
    </div>

    <div className={Styles.body}>
      <Tabs activeKey={signinType} onChange={(key) => setSigninType(key as SigninType)}>
        <TabPane key='password' tab='密码登录'>
          <Form
            form={passwordForm}
            onFinish={geneOnFinish({
              signinType: 'password',
              onSuccess,
            })}
            validateTrigger={'onBlur'}
          >
            <Form.Item
              name='account'
              required
              rules={accountRules}
            >
              <Input allowClear placeholder='手机号或邮箱' />
            </Form.Item>
            <Form.Item
              name='password'
              required
              rules={passwordRules}
            >
              <Input type='password' allowClear placeholder='密码(6-16位英文+数字)' />
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
          <Form
            form={authCodeForm}
            key='authCode'
            onFinish={geneOnFinish({
              signinType: 'authCode',
              onSuccess,
            })}
            validateTrigger={'onBlur'}
          >
            <Form.Item
              name='account'
              required
              rules={accountRules}
            >
              <Input.Search
                placeholder='手机号或邮箱'
                allowClear
                enterButton={duration > 0 ? `${Math.round(duration / 1000)} s 后重试` : '获取验证码'}
                loading={isFetchingAuthCode || duration > 0}
                onSearch={onFetchAuthCode}
                onPressEnter={(e) => {
                  e.stopPropagation()
                }}
              />
            </Form.Item>
            <Form.Item
              name='authCode'
              required
              rules={authCodeRules}
            >
              <Input allowClear placeholder='验证码(4 位)' autoComplete='off' />
            </Form.Item>
            <Tooltip
              trigger='click'
              placement="topLeft"
              title="本网站暂未接入验证码服务, 所以你点击获取验证码, 将会直接弹窗告诉你, 你再填入就可以了"
            >
              <b className={Styles.notice}>
                未注册用户将自动注册 <sup><SearchOutlined /></sup>
              </b>
            </Tooltip>
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

        <TabPane key='qrcode' tab='扫码登录' disabled>
          暂不支持扫码登录
        </TabPane>
      </Tabs>
    </div>

    <div className='body'></div>
  </div>
}
