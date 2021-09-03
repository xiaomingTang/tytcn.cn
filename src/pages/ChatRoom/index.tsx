import React from 'react'
import { useRandomSoftColors } from 'xiaoming-hooks'
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

function RandomComp({ content }: { content: string }) {
  const [bg, color] = useRandomSoftColors()

  return <div style={{
    width: '100%',
    height: '100%',
    padding: '1em',
    fontSize: '2em',
    pointerEvents: 'none',
    backgroundColor: bg,
    color,
  }}>
    {content}
  </div>
}

function ChatRoom() {
  const user = useSelector((state: State) => state.user)
  const chat = useSelector((state: State) => state.chat)

  return <div className={Styles.container}>
    <ChatRoomLayout
      chatList={<ChatList id={user.id} />}
      messageList={<MessageList type={chat.target.type} targetId={chat.target.id} />}
      inputArea={<InputArea
        onSubmit={async (content) => {
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
        }}
      />}
      aside={<Aside />}
    />
  </div>
}

export default ChatRoom
