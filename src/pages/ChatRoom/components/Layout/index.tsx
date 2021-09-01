import React from 'react'

import Styles from './index.module.less'

interface Props {
  chatList: React.ReactNode;
  messageList: React.ReactNode;
  inputArea: React.ReactNode;
  aside: React.ReactNode;
}

export function ChatRoomLayout({
  chatList, messageList, inputArea, aside,
}: Props) {
  return <div className={Styles.container}>
    <div className={Styles.chatList}>
      {chatList}
    </div>
    <div className={Styles.main}>
      <div className={Styles.messageList}>
        {messageList}
      </div>
      <div className={Styles.inputArea}>
        {inputArea}
      </div>
    </div>
    <div className={Styles.aside}>
      {aside}
    </div>
  </div>
}
