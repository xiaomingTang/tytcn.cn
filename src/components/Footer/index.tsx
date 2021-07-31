import { joinSpace } from '@Src/utils/others'
import React, { HTMLAttributes } from 'react'
import { Anchor } from '@Src/components/Anchor'
import Styles from './index.module.less'

export function Footer({
  className, ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={joinSpace(className, Styles.footer)} {...props}>
    <Anchor className={Styles.footerItem} href='https://beian.miit.gov.cn/#/Integrated/index'>赣ICP备2021003257号</Anchor>
    <Anchor className={Styles.footerItem} href='https://github.com/xiaomingTang'>
      © 2021 xiaoming
    </Anchor>
  </div>
}
