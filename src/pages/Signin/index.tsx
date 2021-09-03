import React, { useEffect } from 'react'
import { message } from 'antd'

import { availableBackgroundImages } from '@Src/constants'

import { Apis } from './services'
import { SigninBox } from './components/SigninBox'

import Styles from './index.module.less'

function onSuccess() {
  message.success('登录成功, 即将跳转...')
  window.setTimeout(() => {
    const target = new URL(window.location.href).searchParams.get('next') || '/'
    window.history.replaceState(null, '', target)
    window.location.href = target
  }, 500)
}

function Signin() {
  useEffect(() => {
    Apis.getMyself().then((res) => {
      if (res) {
        onSuccess()
      }
    })
  }, [])

  return <div className={Styles.container} style={{
    backgroundImage: `url(${availableBackgroundImages[0]})`,
  }}>
    <SigninBox className={Styles.signinBoxContainer} onSuccess={onSuccess} />
  </div>
}

export default Signin
