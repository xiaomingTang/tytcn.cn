import {
  message,
} from 'antd'
import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { State } from '@Src/store'
import { useApiWhen } from '@Src/utils/api'

import { Apis, Types } from '../../services'
import { MessageType } from '../../services/types'
import { InputArea } from '../../components/InputArea'

import Styles from './index.module.less'

function GroupChatRoom() {
  const user = useSelector<State, State['user']>((state) => state.user)
  const { groupId } = useParams<{ groupId: string }>()
  const params: Types.GetMessageListQuery = useMemo(() => ({
    fromUserId: user.id,
    toUserId: groupId,
  }), [user.id, groupId])

  const { data: messageList = [] } = useApiWhen(!!(groupId && user.id), Apis.getMessageList, [params])

  const onSubmit = useCallback(async (content: string) => {
    if (user.id && groupId) {
      try {
        const res = await Apis.sendMessage({
          content,
          fromUserId: user.id,
          toGroupIds: [groupId],
          toUserIds: [],
          type: MessageType.Text,
        })
        if (res) {
          message.success('发送成功')
        } else {
          message.error('发送失败')
        }
        return !!res
      } catch (err) {
        message.error(err.message)
        return false
      }
    }
    message.error('用户未登录')
    return false
  }, [groupId, user.id])

  return <>
    {
      // @TODO: 设置样式布局 & api 支持翻页
      messageList.map((msg) => JSON.stringify(msg))
    }
    <InputArea className={Styles.inputArea} onSubmit={onSubmit} />
  </>
}

export default GroupChatRoom
