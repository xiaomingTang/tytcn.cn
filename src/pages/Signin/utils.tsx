import React from 'react'
import store from '@Src/store'

import { simpleModal } from '@Src/utils/simpleModal'
import { SigninBox } from './components/SigninBox'

type SigninBoxDisplay = 'modal' | 'single-page'

/**
 * 直接调用, 根据 type 来决定 跳转到登陆页 或者 弹出登录框
 */
export function signin(type: SigninBoxDisplay): Promise<boolean> {
  return new Promise((resolve, reject) => {
    switch (type) {
      case 'single-page': {
        const target = `/signin?next=${window.encodeURI(window.location.href)}`
        window.location.href = target
        reject(new Error('正在跳转登录...'))
        return
      }
      default: {
        if (window.signinModalVisible) {
          reject(new Error('正在登录'))
          return
        }
        window.signinModalVisible = true
        const { destroy } = simpleModal({
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
                resolve(true)
              }}
            />
          },
          onCancel: () => {
            reject(new Error('已取消登录'))
          },
        })
      }
    }
  })
}
