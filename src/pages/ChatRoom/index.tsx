import React from 'react'
import { useRandomSoftColors } from 'xiaoming-hooks'

import { availableBackgroundImages } from '@Src/constants'

import { ChatRoomLayout } from './components/Layout'
import { MessageList } from './components/MessageList'

import Styles from './index.module.less'

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
  return <div className={Styles.container} style={{
    backgroundImage: `url(${availableBackgroundImages[0]})`,
  }}>
    <ChatRoomLayout
      chatList={<RandomComp content={'chatList'} />}
      messageList={<MessageList type='group' targetId='10387' />}
      inputArea={<RandomComp content={'inputArea'} />}
      aside={<RandomComp content={'aside'} />}
    />
  </div>
}

export default ChatRoom
