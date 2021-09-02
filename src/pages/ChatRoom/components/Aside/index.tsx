import { State, SyncAction } from '@Src/store'
import { useApi } from '@Src/utils/api'
import { List } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { Apis } from '../../services'
import Styles from './index.module.less'

export function Aside() {
  const user = useSelector((state: State) => state.user)
  const dispatch = useDispatch<Dispatch<SyncAction>>()
  const { data: hotUsers } = useApi(Apis.getHotUsers, {
    enable: !!user.id,
  })
  const { data: hotGroups } = useApi(Apis.getHotGroups, {
    enable: !!user.id,
  })

  return <div className={Styles.container}>
    <div className={Styles.hotUsers}>
      <div className={Styles.title}>最新在线用户{hotUsers ? `(${hotUsers.total})` : ''}</div>
      <div className={Styles.content}>
        <List
          bordered
          dataSource={hotUsers?.data}
          renderItem={(item) => (<List.Item className={Styles.userItem} onClick={() => {
            dispatch({
              type: '@chat/update',
              value: {
                type: 'user',
                id: item.id,
                name: item.nickname,
              },
            })
          }}>
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} />}
              title={<span className={Styles.userItemTitle}>
                {item.nickname}
              </span>}
            />
          </List.Item>)}
        />
      </div>
    </div>
    <div className={Styles.hotUsers}>
      <div className={Styles.title}>热门群聊{hotGroups ? `(${hotGroups.total})` : ''}</div>
      <div className={Styles.content}>
        <List
          bordered
          dataSource={hotGroups?.data}
          renderItem={(item) => (<List.Item className={Styles.userItem} onClick={() => {
            dispatch({
              type: '@chat/update',
              value: {
                type: 'group',
                id: item.id,
                name: item.name,
              },
            })
          }}>
            <List.Item.Meta
              avatar={<Avatar>{item.name}</Avatar>}
              title={<span className={Styles.userItemTitle}>
                {item.name}
              </span>}
              description={<span className={Styles.userItemTitle}>
                {item.notice}
              </span>}
            />
          </List.Item>)}
        />
      </div>
    </div>
  </div>
}
