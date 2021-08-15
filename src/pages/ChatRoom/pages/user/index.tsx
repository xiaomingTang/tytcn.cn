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
  const { userId } = useParams<{ userId: string }>()
  const params: Types.GetMessageListQuery = useMemo(() => ({
    fromUserId: user.id,
    toUserId: userId,
  }), [user.id, userId])

  const { data: messageList = [] } = useApiWhen(!!(userId && user.id), Apis.getMessageList, (res) => res, [params])

  const onSubmit = useCallback(async (content: string) => {
    if (user.id && userId) {
      try {
        const res = await Apis.sendMessage({
          content,
          fromUserId: user.id,
          toGroupIds: [],
          toUserIds: [userId],
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
  }, [userId, user.id])

  return <>
    {
      // @TODO: 设置样式布局 & api 支持翻页
      messageList.map((msg) => JSON.stringify(msg))
    }
    <InputArea className={Styles.inputArea} onSubmit={onSubmit} />
  </>
}

export default GroupChatRoom
