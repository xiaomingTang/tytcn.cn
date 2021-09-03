import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { message } from 'antd'

import { State } from '@Src/store'
import { MessageType } from '@Src/constants'

import { ChatRoomLayout } from './components/Layout'
import { MessageList } from './components/MessageList'

import Styles from './index.module.less'
import { Aside } from './components/Aside'
import { InputArea } from './components/InputArea'
import { Apis } from './services'
import { ChatList } from './components/ChatList'

function ChatRoom() {
  const user = useSelector((state: State) => state.user)
  const chat = useSelector((state: State) => state.chat)

  const onSendMessage = useCallback(async (content: string) => {
    try {
      const result = await Apis.sendMessage({
        content: `你好，${chat.target.name || chat.target.id}，我是${user.nickname}: ${content}`,
        fromUserId: user.id,
        type: MessageType.Text,
        toUserId: chat.target.type === 'user' ? chat.target.id : '',
        toGroupId: chat.target.type === 'group' ? chat.target.id : '',
      })
      return !!result
    } catch (error) {
      message.error(error.message)
      return false
    }
  }, [chat.target.id, chat.target.name, chat.target.type, user.id, user.nickname])

  return <div className={Styles.container}>
    <ChatRoomLayout
      chatList={<ChatList id={user.id} />}
      messageList={<MessageList {...chat.target} />}
      // @TODO: inputArea 放到 MessageList 里面
      // @TODO: 移动端在输入时, 将 InputArea position 设为 fixed
      inputArea={<InputArea onSubmit={onSendMessage} />}
      aside={<Aside />}
    />
  </div>
}

export default ChatRoom
