import React, { HTMLAttributes } from 'react'
import { joinSpace } from '@Src/utils/others'

import './iconfont/iconfont.css'

interface Props extends HTMLAttributes<HTMLSpanElement> {
  type: string;
}

export default function Iconfont({
  type, className, style, ...props
}: Props) {
  return <span
    className={joinSpace(
      `iconfont iconfont-${type}`,
      className,
    )}
    style={{
      fontSize: 'inherit',
      ...style,
    }}
    {...props}
  />
}
