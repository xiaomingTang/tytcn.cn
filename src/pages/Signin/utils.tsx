import React from 'react'
import { Modal } from 'antd'
import store from '@Src/store'

import { SigninBox } from './components/SigninBox'

import Styles from './utils.module.less'

type SigninType = 'modal' | 'single-page'

export function signin(type: SigninType) {
  switch (type) {
    case 'single-page': {
      window.location.href = `/signin?from=${window.encodeURI(window.location.href)}`
      break
    }
    default: {
      const { destroy } = Modal.info({
        icon: null,
        closable: true,
        mask: true,
        maskClosable: true,
        keyboard: true,
        okButtonProps: { disabled: true, className: Styles.footerBtn },
        cancelButtonProps: { disabled: true, className: Styles.footerBtn },
        content: <SigninBox onSuccess={(user) => {
          destroy()
          // 更新用户信息 store
          store.dispatch({
            type: '@user/update',
            value: user,
          })
        }} />,
      })
      break
    }
  }
}
