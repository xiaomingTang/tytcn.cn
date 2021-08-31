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
