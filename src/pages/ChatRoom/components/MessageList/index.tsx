import { MenuOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { State, SyncAction } from '@Src/store'
import { ChatTarget } from '@Src/store/chat'
import { useApi } from '@Src/utils/api'
import { joinSpace } from '@Src/utils/others'
import { Avatar, Button } from 'antd'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { Apis, Types } from '../../services'

import Styles from './index.module.less'

export function MessageList(chat: ChatTarget) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const user = useSelector((state: State) => state.user)
  const { chatListVisible, asideVisible } = useSelector((state: State) => state.layout)

  const getMessageListConfig: Types.GetMessageListQuery = useMemo(() => ({
    current: 1,
    pageSize: 20,
    masterId: user.id,
    targetType: chat.type,
    targetId: chat.id,
    order: {
      createdTime: 'ASC',
    },
  }), [chat.id, chat.type, user.id])

  const { data: messageListRes } = useApi(Apis.getMessageList, {
    args: [getMessageListConfig],
    enable: !!chat.id,
  })

  return <div className={Styles.container}>
    <div className={Styles.title}>
      {
        !chatListVisible && <Button
          className={joinSpace(Styles.layoutTrigger, Styles.left)}
          icon={<MenuOutlined />}
          onClick={() => {
            dispatch({
              type: '@layout/update',
              value: {
                chatListVisible: true,
                asideVisible: false,
              },
            })
          }}
        />
      }
      <span className={Styles.chatRoot}>
        {chat.type === 'user' ? <UserOutlined /> : <TeamOutlined />}
        {chat.name || chat.id}
      </span>
      {
        !asideVisible && <Button
          className={joinSpace(Styles.layoutTrigger, Styles.right)}
          icon={<MenuOutlined />}
          onClick={() => {
            dispatch({
              type: '@layout/update',
              value: {
                chatListVisible: false,
                asideVisible: true,
              },
            })
          }}
        />
      }
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
