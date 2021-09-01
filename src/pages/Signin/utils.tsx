import React from 'react'
import {
  Modal,
} from 'antd'
import store from '@Src/store'

import { SigninBox } from './components/SigninBox'

type SigninBoxDisplay = 'modal' | 'single-page'

/**
 * 直接调用, 根据 type 来决定 跳转到登陆页 或者 弹出登录框
 */
export function signin(type: SigninBoxDisplay) {
  switch (type) {
    case 'single-page': {
      const target = `/signin?next=${window.encodeURI(window.location.href)}`
      window.location.href = target
      break
    }
    default: {
      if (window.signinModalVisible) {
        return
      }
      window.signinModalVisible = true
      const { destroy } = Modal.info({
        modalRender() {
          return <SigninBox
            style={{
              pointerEvents: 'all',
            }}
            onSuccess={(user) => {
              window.signinModalVisible = false
              destroy()
              // 更新用户信息 store
              store.dispatch({
                type: '@user/update',
                value: user,
              })
            }}
          />
        },
        // 样式参考 ./index.module.less 内的 .signin-box-container
        width: '80%',
        style: {
          maxWidth: '350px',
          paddingBottom: '0',
          boxShadow: '0 0 20px #565656',
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
