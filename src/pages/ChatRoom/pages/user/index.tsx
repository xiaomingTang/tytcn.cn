import {
  message,
} from 'antd'
import React, {
  useCallback, useMemo, useEffect, useRef,
} from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { State } from '@Src/store'
import { useApiWhen } from '@Src/utils/api'
import { useScrollInfo } from '@Src/utils/scroll'

import { Apis, Types } from '../../services'
import { MessageType } from '../../services/types'
import { InputArea } from '../../components/InputArea'

import Styles from './index.module.less'

function GroupChatRoom() {
  const user = useSelector<State, State['user']>((state) => state.user)
  const { userId } = useParams<{ userId: string }>()
  const getMessageListConfig: Types.GetMessageListQuery = useMemo(() => ({
    fromUserId: user.id,
    toUserId: userId,
  }), [user.id, userId])
  const [scrollInfo, setElement] = useScrollInfo()
  const isInit = useRef(true)
  const scrollInfoRef = useRef(scrollInfo)

  useEffect(() => {
    scrollInfoRef.current = scrollInfo
  }, [scrollInfo])

  const onMessageListUpdated = useCallback(() => {
    const info = scrollInfoRef.current
    if (info.distanceWithBottom === 0) {
      let behavior: ScrollBehavior = 'smooth'
      if (isInit.current) {
        behavior = 'auto'
        isInit.current = false
      }
      // 下一个 event loop 执行滚动(等到节点插入到页面后)
      window.setTimeout(() => {
        info.element.scrollTo({
          top: 999999,
          behavior,
        })
      }, 0)
    }
  }, [])

  const { data: messageList = [], update: updateMessageList } = useApiWhen(!!(userId && user.id), Apis.getMessageList, [getMessageListConfig], (res) => res, onMessageListUpdated)

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
          updateMessageList()
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
  }, [user.id, userId, updateMessageList])

  return <div className={Styles.wrapper}>
    <div className={Styles.messageWrapper} ref={setElement}>
      {
        // @TODO: 设置样式布局 & api 支持翻页
        messageList.map((msg) => <div key={msg.id} id={msg.id} className={Styles.messageItem}>
          <div>id: {msg.id}</div>
          <div>from: {msg.fromUser.id}</div>
          <div>toUsers[0]: {msg.toUsers[0]?.id}</div>
          <div>toGroups[0]: {msg.toGroups[0]?.id}</div>
          <div>content: {msg.content}</div>
        </div>)
      }
    </div>
    <InputArea className={Styles.inputArea} onSubmit={onSubmit} />
  </div>
}

export default GroupChatRoom
