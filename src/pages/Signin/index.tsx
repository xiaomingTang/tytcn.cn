import React from 'react'
import { availableBackgroundImages } from '@Src/constants'
import { SigninBox } from './components/SigninBox'

import Styles from './index.module.less'

function Signin() {
  return <div className={Styles.container} style={{
    backgroundImage: `url(${availableBackgroundImages[0]})`,
  }}>
    <SigninBox className={Styles.signinBoxContainer} />
  </div>
}

export default Signin
