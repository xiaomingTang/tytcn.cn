import { State, SyncAction } from '@Src/store'
import { joinSpace } from '@Src/utils/others'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { useSize } from 'xiaoming-hooks'

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
  const { chatListVisible, asideVisible } = useSelector((state: State) => state.layout)
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const docSize = useSize()

  useEffect(() => {
    dispatch({
      type: '@layout/update',
      value: {
        chatListVisible: docSize.width >= 600,
        asideVisible: docSize.width >= 800,
      },
    })
  }, [dispatch, docSize.width])

  return <div className={Styles.container}>
    <div className={joinSpace(Styles.chatList, !chatListVisible && Styles.hidden)}>
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
    <div className={joinSpace(Styles.aside, !asideVisible && Styles.hidden)}>
      {aside}
    </div>
  </div>
}
