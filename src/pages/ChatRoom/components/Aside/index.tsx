import { useApiWhen } from '@Src/utils/api'
import { List } from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import React from 'react'
import { Apis } from '../../services'
import Styles from './index.module.less'

export function Aside() {
  const { data: hotUsers } = useApiWhen(
    true,
    Apis.getHotUsers,
    [],
  )
  const { data: hotGroups } = useApiWhen(
    true,
    Apis.getHotGroups,
    [],
  )

  return <div className={Styles.container}>
    <div className={Styles.hotUsers}>
      <div className={Styles.title}>最新在线用户</div>
      <div className={Styles.content}>
        <List
          bordered
          dataSource={hotUsers?.data}
          renderItem={(item) => (<List.Item className={Styles.userItem}>
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
      <div className={Styles.title}>热门群聊</div>
      <div className={Styles.content}>
        <List
          bordered
          dataSource={hotGroups?.data}
          renderItem={(item) => (<List.Item className={Styles.userItem}>
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
