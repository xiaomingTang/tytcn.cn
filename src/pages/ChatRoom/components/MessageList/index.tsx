import { ChatTarget } from '@Src/store/chat'
import React from 'react'
import { GroupMessageList } from './group'

import Styles from './index.module.less'
import { UserMessageList } from './user'

interface Props {
  type: ChatTarget['type'];
  targetId?: string;
}

export function MessageList({
  type, targetId = '',
}: Props) {
  if (type === 'user') {
    return <UserMessageList targetId={targetId} />
  }

  if (type === 'group') {
    return <GroupMessageList targetId={targetId} />
  }

  return <div className={Styles.container}>
  </div>
}
