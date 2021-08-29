import {
  message,
} from 'antd'
import React, {
  useCallback, useMemo, useEffect, useRef,
} from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useScrollInfo } from 'xiaoming-hooks'

import { State } from '@Src/store'
import { useApiWhen } from '@Src/utils/api'
import { MessageType } from '@Src/constants'

import { Apis, Types } from '../../services'
import { InputArea } from '../../components/InputArea'

import Styles from './index.module.less'

function UserChatRoom() {
  const user = useSelector<State, State['user']>((state) => state.user)
  const { targetUserId } = useParams<{ targetUserId: string }>()
  const getMessageListConfig: Types.GetMessageListQuery = useMemo(() => ({
    fromUserId: user.id,
    toUserId: targetUserId,
    // 此处的依赖必须使用 user, 不能用 user.id, 因为 user.id 在本地有缓存
  }), [user, targetUserId])
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

  // 此处只要有 targetUserId 就发送请求, 当 user.id 不存在时, 后端报 401 跳转登录
  const { data: messageListRes, update: updateMessageList } = useApiWhen(
    !!targetUserId,
    Apis.getMessageList,
    [getMessageListConfig],
    (res) => res,
    onMessageListUpdated,
  )

  const onSubmit = useCallback(async (content: string) => {
    if (!targetUserId) {
      message.error('目标用户为空')
      return false
    }
    try {
      const res = await Apis.sendMessage({
        content,
        fromUserId: user.id,
        toGroupIds: [],
        toUserIds: [targetUserId],
        type: MessageType.Text,
      })
      if (res) {
        message.success('发送成功')
        updateMessageList()
      } else {
        // 正常情况不会到这儿
        message.error('发送失败')
      }
      return !!res
    } catch (err) {
      message.error(err.message)
      return false
    }
  }, [user.id, targetUserId, updateMessageList])

  return <div className={Styles.wrapper}>
    <div className={Styles.messageWrapper} ref={setElement}>
      {
        // @TODO: 设置样式布局 & api 支持翻页
        messageListRes && messageListRes.data.map((msg) => <div key={msg.id} id={msg.id} className={Styles.messageItem}>
          <div>id: {msg.id}</div>
          <div>from: {msg.fromUser.id}</div>
          <div>toUsers: {msg.toUsers.map((item) => item.nickname)}</div>
          <div>toGroups: {msg.toGroups.map((item) => item.name)}</div>
          <div>content: {msg.content}</div>
        </div>)
      }
    </div>
    <InputArea className={Styles.inputArea} onSubmit={onSubmit} />
  </div>
}

export default UserChatRoom
