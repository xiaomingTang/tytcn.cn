import { Apis, Types } from '@Src/services'
import { State } from '@Src/store'
import { useApiWhen } from '@Src/utils/api'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import Styles from './index.module.less'

interface Props {
  targetId?: string;
}

export function UserMessageList({
  targetId = '',
}: Props) {
  const user = useSelector((state: State) => state.user)

  const getUserConfig: Types.GetUserQuery = useMemo(() => ({ id: targetId }), [targetId])
  const getMessageListConfig: Types.SearchMessageQuery = useMemo(() => ({
    fromUserId: user.id,
    toUserId: targetId,
    current: 1,
    pageSize: 20,
  }), [targetId, user.id])

  const { data: targetUser } = useApiWhen(
    !!targetId,
    Apis.getUser,
    [getUserConfig],
  )

  const { data: messageListRes } = useApiWhen(
    true,
    Apis.searchMessage,
    [getMessageListConfig],
  )

  console.log(messageListRes)

  return <div className={Styles.container}>
    <div className={Styles.title}>
      {user.nickname} -- {targetUser?.nickname || targetId}
    </div>
    {
      messageListRes && <div className={Styles.content}>
        current: {messageListRes.current} <br />
        total: {messageListRes.total} <br />
        pageSize: {messageListRes.pageSize} <br />
        {messageListRes.data.map((item) => (<p key={item.id}>
          {item.fromUser.nickname}: - {item.content}
        </p>))}
      </div>
    }
  </div>
}
