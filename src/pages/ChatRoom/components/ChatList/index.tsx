import { Types as GlobalTypes } from '@Src/services'
import { State, SyncAction } from '@Src/store'
import { ChatTarget } from '@Src/store/chat'
import { useApi } from '@Src/utils/api'
import { List, Typography } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { Apis } from '../../services'
import Styles from './index.module.less'

interface Props {
  id: string;
}

function UserChat(message: GlobalTypes.Message) {
  const user = useSelector((state: State) => state.user)
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const target = message.fromUser.id === user.id ? message.toUser : message.fromUser

  const chatTarget: ChatTarget = {
    id: target.id,
    type: 'user',
    name: target.nickname,
  }
  return <List.Item className={Styles.item} onClick={() => {
    dispatch({
      type: '@chat/update',
      value: chatTarget,
    })
  }}>
    <List.Item.Meta
      avatar={<Avatar src={target.avatar} />}
      title={target.nickname}
      description={<Typography.Text
        ellipsis
        className={Styles.desc}
      >
        {message.content}
      </Typography.Text>}
    />
  </List.Item>
}

function GroupChat(message: GlobalTypes.Message) {
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const chatTarget: ChatTarget = {
    id: message.toGroup.id,
    type: 'group',
    name: message.toGroup.name,
  }
  return <List.Item className={Styles.item} onClick={() => {
    dispatch({
      type: '@chat/update',
      value: chatTarget,
    })
  }}>
    <List.Item.Meta
      avatar={<Avatar src={message.fromUser.avatar} />}
      title={message.toGroup.name}
      description={<Typography.Text
        ellipsis
        className={Styles.desc}
      >
        {message.content}
      </Typography.Text>}
    />
  </List.Item>
}

export function ChatList({ id }: Props) {
  const { data: messageList } = useApi(Apis.getChatList, {
    enable: !!id,
    args: [id],
  })

  return <>
    <List
      bordered
      dataSource={messageList}
      renderItem={(item) => (item.toGroup.id ? <GroupChat {...item} /> : <UserChat {...item} />)}
    />
  </>
}
