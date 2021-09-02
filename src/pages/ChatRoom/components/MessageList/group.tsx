import { Apis, Types } from '@Src/services'
import { State } from '@Src/store'
import { useApi } from '@Src/utils/api'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import Styles from './index.module.less'

interface Props {
  targetId?: string;
}

export function GroupMessageList({
  targetId = '',
}: Props) {
  const user = useSelector((state: State) => state.user)

  const getGroupConfig: Types.GetGroupQuery = useMemo(() => ({ id: targetId }), [targetId])
  const getMessageListConfig: Types.SearchMessageQuery = useMemo(() => ({
    toGroupId: targetId,
    current: 1,
    pageSize: 20,
  }), [targetId])

  const { data: targetGroup } = useApi(Apis.getGroup, {
    args: [getGroupConfig],
    enable: !!targetId,
  })

  const { data: messageListRes } = useApi(Apis.searchMessage, {
    args: [getMessageListConfig],
    enable: !!targetId,
  })

  return <div className={Styles.container}>
    <div className={Styles.title}>
      {targetGroup?.name || targetId}
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
