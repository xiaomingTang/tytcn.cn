import { Apis as GlobalApis, Types as GlobalTypes } from '@Src/services'
import { State } from '@Src/store'
import { useApi } from '@Src/utils/api'
import { joinSpace } from '@Src/utils/others'
import { Avatar } from 'antd'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Apis, Types } from '../../services'

import Styles from './index.module.less'

interface Props {
  targetId?: string;
}

export function UserMessageList({
  targetId = '',
}: Props) {
  const user = useSelector((state: State) => state.user)

  const getUserConfig: GlobalTypes.GetUserQuery = useMemo(() => ({ id: targetId }), [targetId])
  const getMessageListConfig: Types.GetMessageListQuery = useMemo(() => ({
    current: 1,
    pageSize: 20,
    masterId: user.id,
    targetType: 'user',
    targetId,
    order: {
      createdTime: 'ASC',
    },
  }), [targetId, user.id])

  const { data: targetUserRes } = useApi(GlobalApis.getUser, {
    args: [getUserConfig],
    enable: !!targetId,
  })

  const { data: messageListRes } = useApi(Apis.getMessageList, {
    args: [getMessageListConfig],
    enable: !!targetId,
  })

  return <div className={Styles.container}>
    <div className={Styles.title}>
      {targetUserRes?.nickname || targetId}
    </div>
    {
      messageListRes && <div className={Styles.content}>
        {messageListRes.data.map((item) => (<p key={item.id} className={joinSpace(Styles.messageItem, item.fromUser.id !== user.id && Styles.customer)}>
          <Avatar src={item.fromUser.avatar} />
          {item.fromUser.nickname}: - {item.content}
        </p>))}
      </div>
    }
  </div>
}
