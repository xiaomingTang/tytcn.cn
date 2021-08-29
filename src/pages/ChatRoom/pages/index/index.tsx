import React, { useCallback, useMemo } from 'react'

import { availableBackgroundImages } from '@Src/constants'
import { UserModel } from '@Src/models/user'
import { useApiWhen } from '@Src/utils/api'

import { Apis, Types } from '../../services'

import Styles from './index.module.less'
import { InputArea } from '../../components/InputArea'

function Home() {
  const userId = UserModel.getLastOnlineUserId()

  const getMessageListConfig: Types.GetMessageListQuery = useMemo(() => ({
    fromUserId: userId,
    toUserId: userId,
    // 此处的依赖必须使用 user, 不能用 user.id, 因为 user.id 在本地有缓存
  }), [userId])

  const onMessageListUpdated = useCallback(() => {
    console.log('updated')
  }, [])

  // 此处只要有 targetUserId 就发送请求, 当 user.id 不存在时, 后端报 401 跳转登录
  const { data: messageListRes, update: updateMessageList } = useApiWhen(
    true,
    Apis.getMessageList,
    [getMessageListConfig],
    (res) => res,
    onMessageListUpdated,
  )

  return <div className={Styles.container} style={{
    backgroundImage: `url(${availableBackgroundImages[0]})`,
  }}>
    <div className={Styles.menu}>

    </div>
    <InputArea />
  </div>
}

export default Home
